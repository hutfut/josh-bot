import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

// ---------------------------------------------------------------------------
// Types returned to the page component
// ---------------------------------------------------------------------------

export interface AnalyticsData {
	stats: {
		pageviews: number;
		messagesSent: number;
		followupClicks: number;
		sessionsCapped: number;
	};
	voiceDistribution: { voiceId: string; count: number }[];
	personaBreakdown: { persona: string; count: number }[];
	conversationDepth: { depth: number; count: number }[];
	available: boolean;
}

// ---------------------------------------------------------------------------
// PostHog HogQL query helper
// ---------------------------------------------------------------------------

const POSTHOG_API_BASE = 'https://us.i.posthog.com';

async function queryPostHog(sql: string): Promise<unknown[][]> {
	const apiKey = env.POSTHOG_PERSONAL_API_KEY;
	const projectId = env.POSTHOG_PROJECT_ID;

	if (!apiKey || !projectId) {
		throw new Error('PostHog credentials not configured');
	}

	const res = await fetch(`${POSTHOG_API_BASE}/api/projects/${projectId}/query/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			query: {
				kind: 'HogQLQuery',
				query: sql
			}
		})
	});

	if (!res.ok) {
		const body = await res.text().catch(() => '');
		console.error(`[analytics] PostHog query failed (${res.status}):`, body);
		throw new Error(`PostHog query failed: ${res.status}`);
	}

	const data = await res.json();
	return data.results ?? [];
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const QUERY_STATS = `
SELECT
  countIf(event = '$pageview') as pageviews,
  countIf(event = 'message_sent') as messages_sent,
  countIf(event = 'followup_clicked') as followup_clicks,
  countIf(event = 'session_capped') as sessions_capped
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
`;

const QUERY_VOICES = `
SELECT properties.voiceId as voice_id, count() as count
FROM events
WHERE event = 'voice_selected' AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY voice_id ORDER BY count DESC
`;

const QUERY_PERSONAS = `
SELECT properties.persona as persona, count() as count
FROM events
WHERE event = 'persona_selected' AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY persona ORDER BY count DESC
`;

const QUERY_DEPTH = `
SELECT toInt32(properties.messageNumber) as depth, count() as count
FROM events
WHERE event = 'message_sent' AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY depth ORDER BY depth ASC
`;

// ---------------------------------------------------------------------------
// Empty fallback when PostHog is not configured
// ---------------------------------------------------------------------------

const EMPTY_DATA: AnalyticsData = {
	stats: { pageviews: 0, messagesSent: 0, followupClicks: 0, sessionsCapped: 0 },
	voiceDistribution: [],
	personaBreakdown: [],
	conversationDepth: [],
	available: false
};

// ---------------------------------------------------------------------------
// Load function
// ---------------------------------------------------------------------------

export const load: PageServerLoad = async () => {
	if (!env.POSTHOG_PERSONAL_API_KEY || !env.POSTHOG_PROJECT_ID) {
		return EMPTY_DATA;
	}

	try {
		const [statsRows, voiceRows, personaRows, depthRows] = await Promise.all([
			queryPostHog(QUERY_STATS),
			queryPostHog(QUERY_VOICES),
			queryPostHog(QUERY_PERSONAS),
			queryPostHog(QUERY_DEPTH)
		]);

		// Query 1: single row with [pageviews, messages_sent, followup_clicks, sessions_capped]
		const statsRow = statsRows[0] ?? [0, 0, 0, 0];
		const stats = {
			pageviews: Number(statsRow[0]) || 0,
			messagesSent: Number(statsRow[1]) || 0,
			followupClicks: Number(statsRow[2]) || 0,
			sessionsCapped: Number(statsRow[3]) || 0
		};

		// Query 2: rows of [voice_id, count]
		const voiceDistribution = voiceRows.map((row) => ({
			voiceId: String(row[0] ?? 'unknown'),
			count: Number(row[1]) || 0
		}));

		// Query 3: rows of [persona, count]
		const personaBreakdown = personaRows.map((row) => ({
			persona: String(row[0] ?? 'unknown'),
			count: Number(row[1]) || 0
		}));

		// Query 4: rows of [depth, count]
		const conversationDepth = depthRows.map((row) => ({
			depth: Number(row[0]) || 0,
			count: Number(row[1]) || 0
		}));

		return {
			stats,
			voiceDistribution,
			personaBreakdown,
			conversationDepth,
			available: true
		} satisfies AnalyticsData;
	} catch (err) {
		console.error('[analytics] Failed to load PostHog data:', err);
		return EMPTY_DATA;
	}
};
