import type {
	ChatMessage as ChatMessageType,
	ResponseSource,
	Persona,
	ActionPill
} from '$lib/types';
import { models, defaultModel } from '$lib/data/models';
import {
	getGreeting,
	getPersonaWelcome,
	getPrebakedResponse,
	getRandomHotTake,
	hotTakesList,
	HOT_TAKE_LIMIT,
	personaLabels,
	personaInitialFollowUps,
	personaFollowUpPrompts,
	defaultFollowUps,
	emailPillAfter,
	aboutPillAfter,
	type FollowUp
} from '$lib/data/responses';
import { generateMetadata, getReachOutMailtoLink } from './utils';

// ---------------------------------------------------------------------------
// Callbacks — DOM interactions the state module delegates to the component
// ---------------------------------------------------------------------------

export interface ChatCallbacks {
	scrollToBottom: () => Promise<void>;
	resetTextareaHeight: () => void;
}

// ---------------------------------------------------------------------------
// createChatState — reactive chat state + all business logic
// ---------------------------------------------------------------------------

export function createChatState(callbacks: ChatCallbacks) {
	// ---- Reactive state ----
	let selectedModel = $state(defaultModel);
	let messages: ChatMessageType[] = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let currentFollowUps: string[] = $state([]);
	let visitedCategories: Set<string> = $state(new Set());
	let lastResponseSource: string = $state('');
	let lastUserMessage: string = $state('');
	let selectedPersona: Persona | null = $state(null);
	let shownHotTakeIndices: number[] = $state([]);

	// Map from follow-up prompt text to category for client-side pill resolution
	let followUpCategoryMap: Map<string, string> = $state(new Map());

	// Map from follow-up prompt text to action metadata for special link pills
	let followUpActionMap: Map<string, ActionPill> = $state(new Map());

	// ---- Derived ----

	/** Whether to show the "Ask Josh Directly" email button */
	const showAskJosh = $derived(
		!isTyping &&
		lastResponseSource !== '' &&
		lastResponseSource !== 'prebaked'
	);

	// ---- Internal helpers ----

	/**
	 * Pick follow-up prompts from a pool, filtering out already-visited categories.
	 * Keeps the golden-path item (index 0) if its category hasn't been visited,
	 * then randomly selects remaining slots from the rest of the pool.
	 */
	function pickFollowUps(pool: FollowUp[], count: number = 3): string[] {
		const available = pool.filter((f) => !visitedCategories.has(f.category));

		if (available.length === 0) {
			const shuffled = [...pool].sort(() => Math.random() - 0.5);
			const picked = shuffled.slice(0, count);
			for (const f of picked) {
				followUpCategoryMap.set(f.prompt, f.category);
			}
			return picked.map((f) => f.prompt);
		}

		if (available.length <= count) {
			for (const f of available) {
				followUpCategoryMap.set(f.prompt, f.category);
			}
			return available.map((f) => f.prompt);
		}

		// Keep the golden-path item (first available from original order) in position 0
		const goldenIdx = pool.findIndex((f) => !visitedCategories.has(f.category));
		const golden = pool[goldenIdx];
		const rest = available.filter((f) => f !== golden);

		const shuffled = rest.sort(() => Math.random() - 0.5);
		const picked = [golden, ...shuffled.slice(0, count - 1)];
		for (const f of picked) {
			followUpCategoryMap.set(f.prompt, f.category);
		}
		return picked.map((f) => f.prompt);
	}

	function setFollowUps(category?: string) {
		if (category) {
			visitedCategories.add(category);
		}

		// Reset action pill map for each new set of follow-ups
		followUpActionMap = new Map();

		// Use persona-specific follow-ups when a persona is active
		const persona = selectedPersona ?? 'curious';
		const personaMap = personaFollowUpPrompts[persona];
		const pool = category && personaMap[category]
			? personaMap[category]
			: defaultFollowUps;
		currentFollowUps = pickFollowUps(pool);

		// Inject action pills based on category + persona
		if (category) {
			if (emailPillAfter[persona]?.has(category)) {
				const prompt = category === 'salary' ? 'Ask Josh directly' : 'Email Josh directly';
				followUpActionMap.set(prompt, { type: 'email', href: getReachOutMailtoLink() });
				currentFollowUps = [...currentFollowUps, prompt];
			}
			if (aboutPillAfter[persona]?.has(category)) {
				const prompt = 'Skip to his resume';
				followUpActionMap.set(prompt, { type: 'navigate', href: '/about' });
				currentFollowUps = [...currentFollowUps, prompt];
			}
		}
	}

	// ---- Public actions ----

	function initChat() {
		const greeting = getGreeting(selectedModel.id);
		messages = [
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: greeting,
				timestamp: Date.now(),
				source: 'prebaked',
				metadata: generateMetadata('prebaked', greeting.length, Math.round(8 + Math.random() * 12))
			}
		];
		currentFollowUps = [];
		visitedCategories = new Set();
		followUpCategoryMap = new Map();
		followUpActionMap = new Map();
		shownHotTakeIndices = [];
		lastResponseSource = '';
		lastUserMessage = '';
		selectedPersona = null;
		isTyping = false;
		inputValue = '';
	}

	/**
	 * Handle persona selection from the initial pills.
	 */
	async function handlePersonaSelect(persona: Persona) {
		selectedPersona = persona;

		// Add user message showing what they picked
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: personaLabels[persona],
				timestamp: Date.now()
			}
		];

		await callbacks.scrollToBottom();

		// Brief artificial delay for feel
		isTyping = true;
		await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
		isTyping = false;

		// Add persona-specific welcome
		const welcome = getPersonaWelcome(selectedModel.id, persona);
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: welcome,
				timestamp: Date.now(),
				source: 'prebaked',
				metadata: generateMetadata('prebaked', welcome.length, Math.round(8 + Math.random() * 12))
			}
		];

		// Set persona-specific initial follow-ups
		followUpActionMap = new Map();
		const initial = personaInitialFollowUps[persona];
		for (const f of initial) {
			followUpCategoryMap.set(f.prompt, f.category);
		}
		currentFollowUps = pickFollowUps(initial, 4);

		await callbacks.scrollToBottom();
	}

	/**
	 * Handle a prebaked pill click — resolves entirely client-side.
	 */
	async function handlePillClick(prompt: string, category: string) {
		if (isTyping) return;

		// Auto-assign persona if not yet chosen
		if (!selectedPersona) {
			selectedPersona = 'curious';
		}

		// Clear follow-ups while "processing"
		currentFollowUps = [];

		// Add user message
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: prompt,
				timestamp: Date.now()
			}
		];

		await callbacks.scrollToBottom();

		// Brief artificial delay for feel
		isTyping = true;
		await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
		isTyping = false;

		// Look up the response — hot takes use a random picker
		let response: string | null;

		if (category === 'hotTakes') {
			const result = getRandomHotTake(shownHotTakeIndices, selectedModel.id);
			if (result) {
				shownHotTakeIndices = [...shownHotTakeIndices, result.index];
				response = result.text;
			} else {
				response = getPrebakedResponse(category, selectedModel.id);
			}
		} else {
			response = getPrebakedResponse(category, selectedModel.id);
		}

		if (!response) return;

		lastResponseSource = 'prebaked';
		lastUserMessage = prompt;

		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: response,
				timestamp: Date.now(),
				source: 'prebaked',
				metadata: generateMetadata('prebaked', response.length, Math.round(8 + Math.random() * 12))
			}
		];

		setFollowUps(category);

		// For hot takes: allow revisits and inject "another" pill if more are available
		if (category === 'hotTakes') {
			visitedCategories.delete('hotTakes');
			const hasMore =
				shownHotTakeIndices.length < HOT_TAKE_LIMIT &&
				shownHotTakeIndices.length < hotTakesList.length;
			if (hasMore) {
				const anotherPrompt = 'Give me another hot take';
				followUpCategoryMap.set(anotherPrompt, 'hotTakes');
				currentFollowUps = [anotherPrompt, ...currentFollowUps];
			}
		}

		await callbacks.scrollToBottom();
	}

	/**
	 * Handle free-text send — goes to the LLM via /api/chat.
	 */
	async function handleSend(text?: string) {
		const message = text || inputValue.trim();
		if (!message || isTyping) return;

		// If this message matches a follow-up pill, handle it as a pill click
		const category = followUpCategoryMap.get(message);
		if (category) {
			handlePillClick(message, category);
			inputValue = '';
			return;
		}

		// Auto-assign persona if not yet chosen
		if (!selectedPersona) {
			selectedPersona = 'curious';
		}

		// Clear follow-ups while waiting for response
		currentFollowUps = [];

		// Add user message
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: message,
				timestamp: Date.now()
			}
		];

		inputValue = '';
		isTyping = true;
		lastResponseSource = '';
		lastUserMessage = message;

		callbacks.resetTextareaHeight();
		await callbacks.scrollToBottom();

		const requestStartTime = Date.now();

		try {
			// Build conversation history for the API
			const history = messages
				.filter((m) => m.role === 'user' || m.role === 'assistant')
				.slice(0, -1)
				.map((m) => ({ role: m.role, content: m.content }));

			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message,
					modelId: selectedModel.id,
					history,
					persona: selectedPersona
				})
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				isTyping = false;
				const source: ResponseSource = data.source ?? 'error';
				lastResponseSource = source;
				const content = data.response ?? 'Something went wrong. Try again.';
				const latency = Date.now() - requestStartTime;
				messages = [
					...messages,
					{
						id: crypto.randomUUID(),
						role: 'assistant',
						content,
						timestamp: Date.now(),
						source,
						metadata: generateMetadata(source, content.length, latency)
					}
				];
				setFollowUps();
			} else if (res.headers.get('X-Response-Source') === 'llm-stream' && res.body) {
				const streamId = crypto.randomUUID();
				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let first = true;
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					if (first) {
						messages = [
							...messages,
							{
								id: streamId,
								role: 'assistant',
								content: chunk,
								timestamp: Date.now(),
								source: 'llm-stream'
							}
						];
						isTyping = false;
						first = false;
						await callbacks.scrollToBottom();
					} else {
						messages = messages.map((m) =>
							m.id === streamId ? { ...m, content: m.content + chunk } : m
						);
					}
				}
				if (first) {
					isTyping = false;
					const fallbackContent = "I had nothing to add. Try asking something else.";
					const latency = Date.now() - requestStartTime;
					messages = [
						...messages,
						{
							id: streamId,
							role: 'assistant',
							content: fallbackContent,
							timestamp: Date.now(),
							source: 'llm-unavailable',
							metadata: generateMetadata('llm-unavailable', fallbackContent.length, latency)
						}
					];
				} else {
					// Stream complete — attach metadata to the final message
					const latency = Date.now() - requestStartTime;
					messages = messages.map((m) =>
						m.id === streamId
							? { ...m, metadata: generateMetadata('llm-stream', m.content.length, latency) }
							: m
					);
				}
				lastResponseSource = 'llm-stream';
				setFollowUps();
			} else {
				// JSON response (llm-unavailable, error, etc.)
				const data = await res.json();
				isTyping = false;
				const source: ResponseSource = data.source ?? 'error';
				lastResponseSource = source;
				const latency = Date.now() - requestStartTime;
				messages = [
					...messages,
					{
						id: crypto.randomUUID(),
						role: 'assistant',
						content: data.response,
						timestamp: Date.now(),
						source,
						metadata: generateMetadata(source, data.response.length, latency)
					}
				];
				setFollowUps();
			}
		} catch {
			isTyping = false;
			lastResponseSource = 'error';
			const errorContent = "Something went wrong reaching my backend. Which is embarrassing, given this is a portfolio site. Try again — or ask Josh directly.";
			const latency = Date.now() - requestStartTime;
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: errorContent,
					timestamp: Date.now(),
					source: 'error',
					metadata: generateMetadata('error', errorContent.length, latency)
				}
			];
			setFollowUps();
		}

		await callbacks.scrollToBottom();
	}

	function handleModelChange(model: typeof defaultModel) {
		selectedModel = model;
		initChat();
	}

	// ---- Public interface ----

	return {
		// Reactive state (read)
		get messages() { return messages; },
		get isTyping() { return isTyping; },
		get currentFollowUps() { return currentFollowUps; },
		get followUpCategoryMap() { return followUpCategoryMap; },
		get followUpActionMap() { return followUpActionMap; },
		get selectedModel() { return selectedModel; },
		get selectedPersona() { return selectedPersona; },
		get lastUserMessage() { return lastUserMessage; },
		get showAskJosh() { return showAskJosh; },

		// Reactive state (read/write)
		get inputValue() { return inputValue; },
		set inputValue(v: string) { inputValue = v; },

		// Static references
		models,

		// Actions
		initChat,
		handlePersonaSelect,
		handlePillClick,
		handleSend,
		handleModelChange
	};
}

export type ChatState = ReturnType<typeof createChatState>;
