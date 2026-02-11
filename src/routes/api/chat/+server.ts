import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { getSystemPrompt } from '$lib/server/prompts';
import { getRandomLlmUnavailableFallback } from '$lib/data/fallbacks';
import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, per-IP, resets on server restart)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // max requests per window

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function cleanupStaleEntries(): void {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
	lastCleanup = now;
	for (const [ip, entry] of rateLimitMap) {
		if (now > entry.resetAt) {
			rateLimitMap.delete(ip);
		}
	}
}

function isRateLimited(ip: string): boolean {
	cleanupStaleEntries();
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	entry.count++;
	return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

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
const LLM_MODEL = 'claude-3-5-haiku-20241022'; // Haiku for cost efficiency
const MAX_TOKENS = 350;
const MAX_HISTORY_MESSAGES = 10; // send last N messages as context

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// --- Rate limiting ---
	const ip = getClientAddress();
	if (isRateLimited(ip)) {
		return json(
			{
				response:
					"You're sending messages faster than Josh can type, which is saying something. Slow down and try again in a minute.",
				source: 'rate-limit'
			},
			{ status: 429 }
		);
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
