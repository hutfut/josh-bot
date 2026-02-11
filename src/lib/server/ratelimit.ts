/**
 * Rate limiting — durable (Upstash Redis) in production, in-memory for local dev.
 *
 * Two server-side tiers (both per-IP):
 *   - Per-minute:  10 requests / 60s sliding window (burst control)
 *   - Per-day:    100 requests / 24h sliding window (abuse prevention)
 *
 * A third tier — ~20 messages per session — is enforced client-side in state.svelte.ts.
 *
 * If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, uses Upstash.
 * Otherwise falls back to a simple in-memory counter (single-process only).
 */

import { env } from '$env/dynamic/private';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MINUTE_LIMIT = 10;
const MINUTE_WINDOW_MS = 60_000;
const DAY_LIMIT = 100;
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------
export interface RateLimitResult {
	limited: boolean;
	/** Which tier triggered the limit, if any */
	tier?: 'minute' | 'day';
}

// ---------------------------------------------------------------------------
// Upstash implementation (durable, works across serverless invocations)
// ---------------------------------------------------------------------------
let upstashLimiters: { minute: RateLimiter; day: RateLimiter } | null = null;

interface RateLimiter {
	limit: (key: string) => Promise<{ success: boolean }>;
}

async function getUpstashLimiters(): Promise<typeof upstashLimiters> {
	if (upstashLimiters) return upstashLimiters;

	const url = env.UPSTASH_REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) return null;

	const { Redis } = await import('@upstash/redis');
	const { Ratelimit } = await import('@upstash/ratelimit');

	const redis = new Redis({ url, token });

	upstashLimiters = {
		minute: new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(MINUTE_LIMIT, '60 s'),
			prefix: 'rl:min',
			analytics: false
		}),
		day: new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(DAY_LIMIT, '24 h'),
			prefix: 'rl:day',
			analytics: false
		})
	};

	return upstashLimiters;
}

async function checkUpstash(ip: string): Promise<RateLimitResult> {
	const limiters = await getUpstashLimiters();
	if (!limiters) return { limited: false }; // shouldn't happen, but safe fallback

	const minuteResult = await limiters.minute.limit(ip);
	if (!minuteResult.success) return { limited: true, tier: 'minute' };

	const dayResult = await limiters.day.limit(ip);
	if (!dayResult.success) return { limited: true, tier: 'day' };

	return { limited: false };
}

// ---------------------------------------------------------------------------
// In-memory fallback (local dev only — resets on restart, single process)
// ---------------------------------------------------------------------------
const memoryMap = new Map<string, { count: number; resetAt: number }>();
const memoryDayMap = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function cleanupMemory(): void {
	const now = Date.now();
	if (now - lastCleanup < 5 * 60 * 1000) return;
	lastCleanup = now;
	for (const [ip, entry] of memoryMap) {
		if (now > entry.resetAt) memoryMap.delete(ip);
	}
	for (const [ip, entry] of memoryDayMap) {
		if (now > entry.resetAt) memoryDayMap.delete(ip);
	}
}

function checkMemoryLimit(
	map: Map<string, { count: number; resetAt: number }>,
	ip: string,
	max: number,
	windowMs: number
): boolean {
	cleanupMemory();
	const now = Date.now();
	const entry = map.get(ip);

	if (!entry || now > entry.resetAt) {
		map.set(ip, { count: 1, resetAt: now + windowMs });
		return false;
	}

	entry.count++;
	return entry.count > max;
}

function checkMemory(ip: string): RateLimitResult {
	if (checkMemoryLimit(memoryMap, ip, MINUTE_LIMIT, MINUTE_WINDOW_MS)) {
		return { limited: true, tier: 'minute' };
	}
	if (checkMemoryLimit(memoryDayMap, ip, DAY_LIMIT, DAY_WINDOW_MS)) {
		return { limited: true, tier: 'day' };
	}
	return { limited: false };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Returns true if Upstash is configured (durable rate limiting available) */
export function isUpstashConfigured(): boolean {
	return !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

/** Check rate limits for the given IP. Uses Upstash if available, else in-memory. */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
	if (isUpstashConfigured()) {
		try {
			return await checkUpstash(ip);
		} catch (err) {
			console.error('[ratelimit] Upstash error, falling back to memory:', err);
			return checkMemory(ip);
		}
	}
	return checkMemory(ip);
}
