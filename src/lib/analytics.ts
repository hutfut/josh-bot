import posthog from 'posthog-js';
import { env } from '$env/dynamic/public';

// ---------------------------------------------------------------------------
// PostHog analytics: client-only module
// Do NOT import from src/lib/server/.
// ---------------------------------------------------------------------------

let initialized = false;

/**
 * Initialize PostHog. Safe to call during SSR (no-ops)
 * and when the key is missing (no errors in dev).
 */
export function initPostHog(): void {
	if (typeof window === 'undefined') return;
	if (initialized) return;

	if (env.PUBLIC_SKIP_EXTERNAL === 'true') return;

	const key = env.PUBLIC_POSTHOG_KEY;
	if (!key) return;

	posthog.init(key, {
		api_host: 'https://us.i.posthog.com',
		capture_pageview: true,
		capture_pageleave: true
	});

	initialized = true;
}

/**
 * Track a custom event. No-ops if PostHog is not initialized
 * (SSR, missing key, dev without key).
 */
export function track(event: string, properties?: Record<string, unknown>): void {
	if (!initialized) return;
	posthog.capture(event, properties);
}
