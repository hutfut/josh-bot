import type {
	ChatMessage as ChatMessageType,
	ResponseSource,
	Persona,
	ActionPill
} from '$lib/types';
import { voices, defaultVoice } from '$lib/data/models';
import {
	getGreeting,
	personaLabels,
	topicPills,
	personaTopicOrder,
	personaInitialFollowUps,
	defaultFollowUps,
	emailPillAfter,
	aboutPillAfter
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
	let selectedVoice = $state(defaultVoice);
	let messages: ChatMessageType[] = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let currentFollowUps: string[] = $state([]);
	let visitedCategories: Set<string> = $state(new Set());
	let lastResponseSource: string = $state('');
	let lastUserMessage: string = $state('');
	let selectedPersona: Persona | null = $state(null);

	// Map from follow-up prompt text to category for pill dedup tracking
	let followUpCategoryMap: Map<string, string> = $state(new Map());

	// Map from follow-up prompt text to action metadata for special link pills
	let followUpActionMap: Map<string, ActionPill> = $state(new Map());

	// ---- Derived ----

	/** Whether to show the "Ask Josh Directly" email button */
	const showAskJosh = $derived(
		!isTyping &&
		lastResponseSource !== '' &&
		lastResponseSource !== 'error'
	);

	// ---- Internal helpers ----

	/**
	 * Pick follow-up pills from a list of category IDs.
	 * Filters out already-visited categories and returns the next batch.
	 */
	function pickFollowUps(categoryIds: string[], count: number = 3): string[] {
		const available = categoryIds.filter((id) => !visitedCategories.has(id));
		const toShow = available.length > 0 ? available.slice(0, count) : categoryIds.slice(0, count);

		const result: string[] = [];
		for (const id of toShow) {
			const pill = topicPills[id];
			if (pill) {
				followUpCategoryMap.set(pill.prompt, pill.category);
				result.push(pill.prompt);
			}
		}
		return result;
	}

	/**
	 * Generate follow-up pills based on the current persona and last category.
	 * Also injects action pills (email, resume link) where appropriate.
	 */
	function setFollowUps(category?: string) {
		if (category) {
			visitedCategories.add(category);
		}

		// Reset action pill map for each new set of follow-ups
		followUpActionMap = new Map();

		const persona = selectedPersona ?? 'curious';
		const topicOrder = personaTopicOrder[persona];
		currentFollowUps = pickFollowUps(topicOrder);

		// Inject action pills based on category + persona
		if (category) {
			if (emailPillAfter[persona]?.has(category)) {
				const prompt = 'Email Josh directly';
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
		const greeting = getGreeting(selectedVoice.id);
		messages = [
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: greeting,
				timestamp: Date.now()
			}
		];
		currentFollowUps = [];
		visitedCategories = new Set();
		followUpCategoryMap = new Map();
		followUpActionMap = new Map();
		lastResponseSource = '';
		lastUserMessage = '';
		selectedPersona = null;
		isTyping = false;
		inputValue = '';
	}

	/**
	 * Handle persona selection from the initial pills.
	 * Sends the persona label to the LLM for a voice-appropriate welcome.
	 */
	async function handlePersonaSelect(persona: Persona) {
		selectedPersona = persona;

		// Send persona label to LLM — skip automatic follow-up generation
		await handleSend(personaLabels[persona], true);

		// Set persona-specific initial follow-ups
		const initial = personaInitialFollowUps[persona];
		followUpCategoryMap = new Map();
		followUpActionMap = new Map();
		const result: string[] = [];
		for (const id of initial) {
			const pill = topicPills[id];
			if (pill) {
				followUpCategoryMap.set(pill.prompt, pill.category);
				result.push(pill.prompt);
			}
		}
		currentFollowUps = result;
	}

	/**
	 * Handle any message — pill clicks and free-text both go to the LLM.
	 * @param text - The message text (uses inputValue if not provided)
	 * @param skipFollowUps - If true, don't auto-generate follow-ups (used by handlePersonaSelect)
	 */
	async function handleSend(text?: string, skipFollowUps: boolean = false) {
		const message = text || inputValue.trim();
		if (!message || isTyping) return;

		// Check if this message matches a pill category (for visited tracking)
		const category = followUpCategoryMap.get(message);

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
					voiceId: selectedVoice.id,
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
				if (!skipFollowUps) setFollowUps(category);
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
				if (!skipFollowUps) setFollowUps(category);
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
				if (!skipFollowUps) setFollowUps(category);
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
			if (!skipFollowUps) setFollowUps();
		}

		await callbacks.scrollToBottom();
	}

	function handleVoiceChange(voice: typeof defaultVoice) {
		selectedVoice = voice;
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
		get selectedVoice() { return selectedVoice; },
		get selectedPersona() { return selectedPersona; },
		get lastUserMessage() { return lastUserMessage; },
		get showAskJosh() { return showAskJosh; },

		// Reactive state (read/write)
		get inputValue() { return inputValue; },
		set inputValue(v: string) { inputValue = v; },

		// Static references
		voices,

		// Actions
		initChat,
		handlePersonaSelect,
		handleSend,
		handleVoiceChange
	};
}

export type ChatState = ReturnType<typeof createChatState>;
