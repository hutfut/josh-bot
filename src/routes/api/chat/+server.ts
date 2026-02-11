import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { getSystemPrompt } from '$lib/server/prompts';
import { getRandomLlmUnavailableFallback } from '$lib/data/fallbacks';
import { checkRateLimit } from '$lib/server/ratelimit';
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
const LLM_MODEL = 'claude-haiku-4-5-20251001'; // Haiku for cost efficiency
const MAX_TOKENS = 350;
const MAX_HISTORY_MESSAGES = 3; // send last N messages as context (keeps input tokens low)
const MAX_MESSAGE_LENGTH = 1000; // max characters per user message

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
		history?: { role: string; content: string }[];
		persona?: Persona;
	};
	try {
		body = await request.json();
	} catch {
		return json({ response: 'Invalid request.', source: 'error' }, { status: 400 });
	}

	const { message, voiceId, history = [], persona } = body;

	if (!message || typeof message !== 'string') {
		return json({ response: 'No message provided.', source: 'error' }, { status: 400 });
	}

	// --- Input length validation ---
	if (message.length > MAX_MESSAGE_LENGTH) {
		return json(
			{
				response: `That message is ${message.length} characters. I have a ${MAX_MESSAGE_LENGTH}-character limit — I'm a portfolio chatbot, not a therapist.`,
				source: 'error'
			},
			{ status: 400 }
		);
	}

	// --- LLM ---
	const client = getClient();
	if (!client) {
		// No API key configured — return a fallback
		return json({
			response: getRandomLlmUnavailableFallback(),
			source: 'llm-unavailable'
		});
	}

	try {
		const systemPrompt = getSystemPrompt(voiceId, persona);

		// Build conversation history for the LLM (last N messages)
		const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
			role: msg.role as 'user' | 'assistant',
			content: msg.content
		}));

		// Ensure the current message is included as the final user message
		const messages = [...trimmedHistory, { role: 'user' as const, content: message }];

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
				try {
					for await (const event of stream) {
						if (
							event.type === 'content_block_delta' &&
							event.delta?.type === 'text_delta' &&
							typeof event.delta.text === 'string'
						) {
							controller.enqueue(encoder.encode(event.delta.text));
						}
					}
				} catch (err) {
					console.error('[api/chat] LLM stream error:', err);
				} finally {
					controller.close();
				}
			}
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Response-Source': 'llm-stream'
			}
		});
	} catch (err) {
		console.error('[api/chat] LLM error:', err);
		return json({
			response: getRandomLlmUnavailableFallback(),
			source: 'llm-unavailable'
		});
	}
};
