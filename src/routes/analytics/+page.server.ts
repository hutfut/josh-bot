import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import { EMPTY_DATA, fetchAnalyticsData } from '$lib/server/analytics';

export type { AnalyticsData } from '$lib/server/analytics';

// ---------------------------------------------------------------------------
// Load function
// ---------------------------------------------------------------------------

export const load: PageServerLoad = async ({ setHeaders, url }) => {
	// CDN cache: serve stale instantly, revalidate in background after 30 min
	setHeaders({
		'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600'
	});

	if (!env.POSTHOG_PERSONAL_API_KEY || !env.POSTHOG_PROJECT_ID) {
		return { ...EMPTY_DATA, ogImageUrl: '' };
	}

	try {
		const data = await fetchAnalyticsData();

		// Cache-busting hash for OG image: changes when voice data or key stats change
		const dataSig =
			data.voiceDistribution.map((v) => `${v.voiceId}:${v.count}`).join(',') +
			`|${data.stats.pageviews}|${data.stats.messagesSent}`;
		const ogHash = createHash('sha256').update(dataSig).digest('hex').slice(0, 12);

		return {
			...data,
			ogImageUrl: `${url.origin}/api/og/analytics/${ogHash}`
		};
	} catch (err) {
		console.error('[analytics] Failed to load PostHog data:', err);
		return { ...EMPTY_DATA, ogImageUrl: '' };
	}
};
