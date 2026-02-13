import type {
	ChatMessage as ChatMessageType,
	ResponseSource,
	Persona,
	ActionPill
} from '$lib/types';
import { voices, defaultVoice } from '$lib/data/models';
import { getGreeting, personaLabels } from '$lib/data/responses';
import { generateMetadata } from './utils';

// ---------------------------------------------------------------------------
// Callbacks: DOM interactions the state module delegates to the component
// ---------------------------------------------------------------------------

export interface ChatCallbacks {
	scrollToBottom: () => Promise<void>;
	resetTextareaHeight: () => void;
}

// ---------------------------------------------------------------------------
// createChatState: reactive chat state + all business logic
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Session config
// ---------------------------------------------------------------------------
const SESSION_MESSAGE_LIMIT = 20; // max user messages per session before capping

// ---------------------------------------------------------------------------
// Follow-up parsing: extracts LLM-generated pills from response text
// ---------------------------------------------------------------------------
const FOLLOWUPS_MARKER = '[FOLLOWUPS]';

function parseFollowUps(raw: string): { content: string; followUps: string[] } {
	const idx = raw.indexOf(FOLLOWUPS_MARKER);
	if (idx === -1) return { content: raw.trim(), followUps: [] };

	const content = raw.slice(0, idx).trim();
	const followUpBlock = raw.slice(idx + FOLLOWUPS_MARKER.length).trim();
	const followUps = followUpBlock
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	return { content, followUps };
}

export function createChatState(callbacks: ChatCallbacks) {
	// ---- Reactive state ----
	let selectedVoice = $state(defaultVoice);
	let messages: ChatMessageType[] = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let currentFollowUps: string[] = $state([]);
	let lastResponseSource: string = $state('');
	let lastUserMessage: string = $state('');
	let selectedPersona: Persona | null = $state(null);
	let sessionId: string | null = $state(null);
	let sessionMessageCount = $state(0);
	let sessionCapped = $state(false);

	// Map from follow-up prompt text to action metadata for special link pills
	let followUpActionMap: Map<string, ActionPill> = $state(new Map());

	// ---- Derived ----

	/** Whether to show the "Ask Josh Directly" email button */
	const showAskJosh = $derived(
		!isTyping &&
		(sessionCapped || (lastResponseSource !== '' && lastResponseSource !== 'error'))
	);

	// ---- Internal helpers ----

	/**
	 * Apply parsed follow-ups from the LLM response.
	 */
	function applyFollowUps(followUps: string[]) {
		followUpActionMap = new Map();
		currentFollowUps = [...followUps];
	}

	// ---- Public actions ----

	function initChat() {
		const greeting = getGreeting(selectedVoice.id);
		messages = [
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: greeting,
				timestamp: Date.now(),
				voiceName: selectedVoice.name,
				voiceId: selectedVoice.id
			}
		];
		currentFollowUps = [];
		followUpActionMap = new Map();
		lastResponseSource = '';
		lastUserMessage = '';
		selectedPersona = null;
		sessionId = null;
		isTyping = false;
		inputValue = '';
		sessionMessageCount = 0;
		sessionCapped = false;
	}

	/**
	 * Handle persona selection from the initial pills.
	 * Sends the persona label to the LLM for a voice-appropriate welcome.
	 */
	async function handlePersonaSelect(persona: Persona) {
		selectedPersona = persona;
		await handleSend(personaLabels[persona]);
	}

	/**
	 * Handle any message: pill clicks and free-text both go to the LLM.
	 * @param text - The message text (uses inputValue if not provided)
	 */
	async function handleSend(text?: string) {
		const message = text || inputValue.trim();
		if (!message || isTyping || sessionCapped) return;

		// Auto-assign persona if not yet chosen
		if (!selectedPersona) {
			selectedPersona = 'curious';
		}

		// Track session message count and enforce cap
		sessionMessageCount++;
		if (sessionMessageCount > SESSION_MESSAGE_LIMIT) {
			sessionCapped = true;
			inputValue = '';

			// Add the user message so they see what they typed
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'user',
					content: message,
					timestamp: Date.now()
				}
			];

			// Show session-ended message with email CTA
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: "You've used your session allocation, which means you're either genuinely interested or stress-testing my limits. Either way, the best next step is talking to the real Josh. He's friendlier than me and has fewer token constraints.",
					timestamp: Date.now(),
					voiceName: selectedVoice.name,
					voiceId: selectedVoice.id
				}
			];

			// Clear follow-ups: AskJoshButton handles the email CTA
			currentFollowUps = [];
			followUpActionMap = new Map();

			await callbacks.scrollToBottom();
			return;
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
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message,
					voiceId: selectedVoice.id,
					sessionId,
					persona: selectedPersona
				})
			});

			// Store server-assigned session ID
			const newSessionId = res.headers.get('X-Session-Id');
			if (newSessionId) sessionId = newSessionId;

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
						metadata: generateMetadata(source, content.length, latency),
						voiceName: selectedVoice.name,
						voiceId: selectedVoice.id
					}
				];
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
								source: 'llm-stream',
								voiceName: selectedVoice.name,
								voiceId: selectedVoice.id
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
							metadata: generateMetadata('llm-unavailable', fallbackContent.length, latency),
							voiceName: selectedVoice.name,
							voiceId: selectedVoice.id
						}
					];
				} else {
					// Stream complete: parse follow-ups from the raw response
					const rawMsg = messages.find((m) => m.id === streamId);
					if (rawMsg) {
						const parsed = parseFollowUps(rawMsg.content);
						const latency = Date.now() - requestStartTime;
						// Update message with clean content (no follow-up marker) and metadata
						messages = messages.map((m) =>
							m.id === streamId
								? { ...m, content: parsed.content, metadata: generateMetadata('llm-stream', parsed.content.length, latency) }
								: m
						);
						applyFollowUps(parsed.followUps);
					}
				}
				lastResponseSource = 'llm-stream';
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
						metadata: generateMetadata(source, data.response.length, latency),
						voiceName: selectedVoice.name,
						voiceId: selectedVoice.id
					}
				];
			}
		} catch {
			isTyping = false;
			lastResponseSource = 'error';
			const errorContent = "Something went wrong reaching my backend. Which is embarrassing, given this is a portfolio site. Try again, or ask Josh directly.";
			const latency = Date.now() - requestStartTime;
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: errorContent,
					timestamp: Date.now(),
					source: 'error',
					metadata: generateMetadata('error', errorContent.length, latency),
					voiceName: selectedVoice.name,
					voiceId: selectedVoice.id
				}
			];
		}

		await callbacks.scrollToBottom();
	}

	function handleVoiceChange(voice: typeof defaultVoice) {
		selectedVoice = voice;
		// Pre-conversation: rewrite the greeting to match the new voice
		if (messages.length <= 1) {
			initChat();
		}
	}

	// ---- Public interface ----

	return {
		// Reactive state (read)
		get messages() { return messages; },
		get isTyping() { return isTyping; },
		get sessionCapped() { return sessionCapped; },
		get currentFollowUps() { return currentFollowUps; },
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
