import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { getSystemPrompt, VALID_VOICE_IDS, VALID_PERSONAS } from '$lib/server/prompts';
import { getRandomLlmUnavailableFallback } from '$lib/data/fallbacks';
import { checkRateLimit } from '$lib/server/ratelimit';
import { sanitizeInput, checkOutputForLeaks } from '$lib/server/sanitize';
import {
	createSession,
	getSession,
	addMessage,
	getRecentHistory
} from '$lib/server/sessions';
import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Anthropic client (lazy — only created if API key exists)
// ---------------------------------------------------------------------------
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic | null {
	if (!env.ANTHROPIC_API_KEY) return null;
	if (!anthropicClient) {
		anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
	}
	return anthropicClient;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const LLM_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 350;
const MAX_HISTORY_MESSAGES = 3; // send last N messages as context
const MAX_MESSAGE_LENGTH = 1000; // max characters per user message

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip [FOLLOWUPS] metadata from a response before storing in session history. */
function stripFollowUps(text: string): string {
	const idx = text.indexOf('[FOLLOWUPS]');
	return idx === -1 ? text : text.slice(0, idx).trim();
}

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// --- Rate limiting ---
	const ip = getClientAddress();
	const rateCheck = await checkRateLimit(ip);

	if (rateCheck.limited) {
		const response =
			rateCheck.tier === 'day'
				? "You've hit your daily limit. Josh is flattered by the attention, but come back tomorrow — or just email him directly."
				: "You're sending messages faster than Josh can type, which is saying something. Slow down and try again in a minute.";
		return json({ response, source: 'rate-limit' }, { status: 429 });
	}

	// --- Parse request ---
	let body: {
		message: string;
		voiceId: string;
		sessionId?: string;
		persona?: Persona;
	};
	try {
		body = await request.json();
	} catch {
		return json({ response: 'Invalid request.', source: 'error' }, { status: 400 });
	}

	const { message, voiceId, sessionId: clientSessionId, persona } = body;

	// --- Input type validation ---
	if (!message || typeof message !== 'string') {
		return json({ response: 'No message provided.', source: 'error' }, { status: 400 });
	}

	if (message.length > MAX_MESSAGE_LENGTH) {
		return json(
			{
				response: `That message is ${message.length} characters. I have a ${MAX_MESSAGE_LENGTH}-character limit — I'm a portfolio chatbot, not a therapist.`,
				source: 'error'
			},
			{ status: 400 }
		);
	}

	// --- Allowlist validation (voiceId, persona) ---
	const safeVoiceId = VALID_VOICE_IDS.has(voiceId) ? voiceId : 'butler';
	const safePersona: Persona | undefined =
		persona && VALID_PERSONAS.has(persona) ? persona : undefined;

	// --- Input sanitization (injection detection) ---
	const sanitized = sanitizeInput(message);
	if (sanitized.flagged) {
		console.warn(
			`[api/chat] Injection attempt detected from ${ip}:`,
			sanitized.labels,
			`— message: "${message.slice(0, 120)}..."`
		);
		// Don't block — the hardened prompt handles it. But we log it.
		// For high-confidence patterns, you could return a canned response here.
	}

	// --- Session management ---
	let sessionId: string;

	if (clientSessionId) {
		const existing = getSession(clientSessionId);
		if (existing) {
			// Valid session — use server-stored voiceId/persona (ignore client values)
			sessionId = clientSessionId;
		} else {
			// Session expired or invalid — create fresh
			const newId = createSession(ip, safeVoiceId, safePersona);
			if (!newId) {
				return json(
					{
						response:
							'Too many active sessions. Close a tab or wait a bit.',
						source: 'error'
					},
					{ status: 429 }
				);
			}
			sessionId = newId;
		}
	} else {
		// First message — create new session
		const newId = createSession(ip, safeVoiceId, safePersona);
		if (!newId) {
			return json(
				{
					response:
						'Too many active sessions. Close a tab or wait a bit.',
					source: 'error'
				},
				{ status: 429 }
			);
		}
		sessionId = newId;
	}

	// --- Server-side session cap ---
	const addResult = addMessage(sessionId, 'user', sanitized.normalized);
	if (!addResult.ok) {
		if (addResult.sessionCapped) {
			return json(
				{
					response:
						"You've used your session allocation — which means you're either genuinely interested or stress-testing my limits. Either way, the best next step is talking to the real Josh.",
					source: 'rate-limit',
					sessionId
				},
				{
					status: 429,
					headers: { 'X-Session-Id': sessionId }
				}
			);
		}
		return json(
			{ response: 'Session error. Try refreshing.', source: 'error' },
			{ status: 500 }
		);
	}

	// --- LLM ---
	const client = getClient();
	if (!client) {
		return json({
			response: getRandomLlmUnavailableFallback(),
			source: 'llm-unavailable',
			sessionId
		});
	}

	try {
		// Use session's stored voiceId/persona (not client-supplied values)
		const session = getSession(sessionId);
		const systemPrompt = getSystemPrompt(
			session?.voiceId ?? safeVoiceId,
			session?.persona ?? safePersona
		);

		// Build conversation history from server-side session store
		const history = getRecentHistory(sessionId, MAX_HISTORY_MESSAGES);

		// History already includes the user message we just added, so just
		// convert to the format Claude expects
		const messages = history.map((msg) => ({
			role: msg.role as 'user' | 'assistant',
			content: msg.content
		}));

		const stream = await client.messages.create({
			model: LLM_MODEL,
			max_tokens: MAX_TOKENS,
			system: systemPrompt,
			messages,
			stream: true
		});

		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				let fullText = '';
				try {
					for await (const event of stream) {
						if (
							event.type === 'content_block_delta' &&
							event.delta?.type === 'text_delta' &&
							typeof event.delta.text === 'string'
						) {
							const chunk = event.delta.text;
							fullText += chunk;

							// --- Output leak detection ---
							const leakCheck = checkOutputForLeaks(fullText);
							if (leakCheck.leaked) {
								console.error(
									'[api/chat] OUTPUT LEAK DETECTED:',
									leakCheck.markers,
									`— session: ${sessionId}, ip: ${ip}`
								);
								controller.enqueue(
									encoder.encode(
										"\n\nI seem to have gotten confused. Let's talk about Josh instead — what would you like to know?"
									)
								);
								break;
							}

							controller.enqueue(encoder.encode(chunk));
						}
					}
				} catch (err) {
					console.error('[api/chat] LLM stream error:', err);
				} finally {
					// Store the clean assistant response in the session
					if (fullText) {
						const cleanContent = stripFollowUps(fullText);
						addMessage(sessionId, 'assistant', cleanContent);
					}
					controller.close();
				}
			}
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Response-Source': 'llm-stream',
				'X-Session-Id': sessionId
			}
		});
	} catch (err) {
		console.error('[api/chat] LLM error:', err);
		return json({
			response: getRandomLlmUnavailableFallback(),
			source: 'llm-unavailable',
			sessionId
		});
	}
};
