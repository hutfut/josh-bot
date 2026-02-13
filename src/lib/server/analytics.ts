import { env } from '$env/dynamic/private';

// ---------------------------------------------------------------------------
// Types returned to page components and OG image endpoint
// ---------------------------------------------------------------------------

export interface AnalyticsData {
	stats: {
		pageviews: number;
		messagesSent: number;
		followupClicks: number;
		sessionsCapped: number;
		totalTokens: number;
		llmResponses: number;
		avgTokensPerResponse: number;
	};
	pageviewsByRoute: { route: string; count: number }[];
	voiceDistribution: { voiceId: string; count: number }[];
	personaBreakdown: { persona: string; count: number }[];
	conversationDepth: { depth: number; count: number }[];
	available: boolean;
}

export const EMPTY_DATA: AnalyticsData = {
	stats: {
		pageviews: 0,
		messagesSent: 0,
		followupClicks: 0,
		sessionsCapped: 0,
		totalTokens: 0,
		llmResponses: 0,
		avgTokensPerResponse: 0
	},
	pageviewsByRoute: [],
	voiceDistribution: [],
	personaBreakdown: [],
	conversationDepth: [],
	available: false
};

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
SELECT toInt(properties.messageNumber) as depth, count() as count
FROM events
WHERE event = 'message_sent' AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY depth ORDER BY depth ASC
`;

const QUERY_PAGEVIEWS_BY_ROUTE = `
SELECT
  properties.$pathname as route,
  count() as count
FROM events
WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY
GROUP BY route ORDER BY count DESC
`;

const QUERY_TOKENS = `
SELECT
  sum(toInt(properties.tokens)) as total_tokens,
  count() as llm_responses,
  avg(toInt(properties.tokens)) as avg_tokens
FROM events
WHERE event = 'tokens_used' AND timestamp >= now() - INTERVAL 30 DAY
`;

// ---------------------------------------------------------------------------
// In-memory cache (survives warm function instances; CDN cache handles the edge)
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

let cachedData: AnalyticsData | null = null;
let cachedAt = 0;

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
	const now = Date.now();
	if (cachedData && now - cachedAt < CACHE_TTL_MS) {
		return cachedData;
	}

	const [statsRows, pageviewRouteRows, voiceRows, personaRows, depthRows, tokenRows] =
		await Promise.all([
			queryPostHog(QUERY_STATS),
			queryPostHog(QUERY_PAGEVIEWS_BY_ROUTE),
			queryPostHog(QUERY_VOICES),
			queryPostHog(QUERY_PERSONAS),
			queryPostHog(QUERY_DEPTH),
			queryPostHog(QUERY_TOKENS)
		]);

	// Query 1: single row with [pageviews, messages_sent, followup_clicks, sessions_capped]
	const statsRow = statsRows[0] ?? [0, 0, 0, 0];

	// Query 6: single row with [total_tokens, llm_responses, avg_tokens]
	const tokenRow = tokenRows[0] ?? [0, 0, 0];

	const stats = {
		pageviews: Number(statsRow[0]) || 0,
		messagesSent: Number(statsRow[1]) || 0,
		followupClicks: Number(statsRow[2]) || 0,
		sessionsCapped: Number(statsRow[3]) || 0,
		totalTokens: Number(tokenRow[0]) || 0,
		llmResponses: Number(tokenRow[1]) || 0,
		avgTokensPerResponse: Math.round(Number(tokenRow[2]) || 0)
	};

	// Query 2: rows of [route, count]
	const pageviewsByRoute = pageviewRouteRows.map((row) => ({
		route: String(row[0] ?? '/'),
		count: Number(row[1]) || 0
	}));

	// Query 3: rows of [voice_id, count]
	const voiceDistribution = voiceRows.map((row) => ({
		voiceId: String(row[0] ?? 'unknown'),
		count: Number(row[1]) || 0
	}));

	// Query 4: rows of [persona, count]
	const personaBreakdown = personaRows.map((row) => ({
		persona: String(row[0] ?? 'unknown'),
		count: Number(row[1]) || 0
	}));

	// Query 5: rows of [depth, count]
	const conversationDepth = depthRows.map((row) => ({
		depth: Number(row[0]) || 0,
		count: Number(row[1]) || 0
	}));

	const result: AnalyticsData = {
		stats,
		pageviewsByRoute,
		voiceDistribution,
		personaBreakdown,
		conversationDepth,
		available: true
	};

	cachedData = result;
	cachedAt = now;
	return result;
}
