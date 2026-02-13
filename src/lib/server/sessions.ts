/**
 * Server-side session store for conversation history.
 *
 * Prevents clients from injecting fabricated conversation history into LLM
 * context: the single most critical prompt injection vector.
 *
 * Uses in-memory storage (sufficient for single-instance and warm serverless).
 * For durable cross-instance persistence, swap with a Redis-backed store
 * (same pattern as ratelimit.ts with Upstash).
 */

import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface Session {
	id: string;
	messages: SessionMessage[];
	voiceId: string;
	persona: Persona | undefined;
	createdAt: number;
	lastActivity: number;
	ip: string;
	userMessageCount: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_SESSIONS_PER_IP = 5;
const MAX_STORED_MESSAGES = 40; // absolute cap on stored messages per session
const SESSION_USER_MESSAGE_LIMIT = 20; // max user messages before session is capped
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // run cleanup every 5 min

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const sessions = new Map<string, Session>();
let lastCleanup = Date.now();

function cleanup(): void {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
	lastCleanup = now;
	for (const [id, session] of sessions) {
		if (now - session.lastActivity > SESSION_TTL_MS) {
			sessions.delete(id);
		}
	}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a new session. Returns the session ID, or null if the IP has too
 * many active sessions.
 */
export function createSession(
	ip: string,
	voiceId: string,
	persona?: Persona
): string | null {
	cleanup();

	// Enforce per-IP session limit
	let ipCount = 0;
	for (const session of sessions.values()) {
		if (session.ip === ip && Date.now() - session.lastActivity < SESSION_TTL_MS) {
			ipCount++;
		}
	}
	if (ipCount >= MAX_SESSIONS_PER_IP) return null;

	const id = crypto.randomUUID();
	sessions.set(id, {
		id,
		messages: [],
		voiceId,
		persona,
		createdAt: Date.now(),
		lastActivity: Date.now(),
		ip,
		userMessageCount: 0
	});

	return id;
}

/**
 * Retrieve a session by ID. Returns null if expired or not found.
 */
export function getSession(
	id: string
): { voiceId: string; persona: Persona | undefined } | null {
	const session = sessions.get(id);
	if (!session) return null;
	if (Date.now() - session.lastActivity > SESSION_TTL_MS) {
		sessions.delete(id);
		return null;
	}
	session.lastActivity = Date.now();
	return { voiceId: session.voiceId, persona: session.persona };
}

/**
 * Add a message to a session's history.
 * Returns `{ ok: true }` on success, or `{ ok: false, sessionCapped }` if
 * the session is exhausted or doesn't exist.
 */
export function addMessage(
	sessionId: string,
	role: 'user' | 'assistant',
	content: string
): { ok: boolean; sessionCapped?: boolean } {
	const session = sessions.get(sessionId);
	if (!session) return { ok: false };

	if (role === 'user') {
		session.userMessageCount++;
		if (session.userMessageCount > SESSION_USER_MESSAGE_LIMIT) {
			return { ok: false, sessionCapped: true };
		}
	}

	session.messages.push({ role, content });

	// Trim stored history if it exceeds the absolute cap
	if (session.messages.length > MAX_STORED_MESSAGES) {
		session.messages = session.messages.slice(-MAX_STORED_MESSAGES);
	}

	session.lastActivity = Date.now();
	return { ok: true };
}

/**
 * Get the most recent N messages from a session's history.
 */
export function getRecentHistory(
	sessionId: string,
	limit: number
): SessionMessage[] {
	const session = sessions.get(sessionId);
	if (!session) return [];
	return session.messages.slice(-limit);
}
