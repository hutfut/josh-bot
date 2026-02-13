import type { RequestHandler } from './$types';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { env } from '$env/dynamic/private';
import { fetchAnalyticsData } from '$lib/server/analytics';

// ---------------------------------------------------------------------------
// Display names & palette (matches the analytics page)
// ---------------------------------------------------------------------------

const voiceNames: Record<string, string> = {
	butler: 'The Butler',
	engineer: 'The Engineer',
	spokesperson: 'The Spokesperson',
	hype: 'The Hype Man'
};

const palette = ['#8B5CF6', '#34D399', '#FBBF24', '#F472B6', '#60A5FA', '#F87171'];

// ---------------------------------------------------------------------------
// Font loading – cached across warm invocations
// ---------------------------------------------------------------------------

let fontCache: ArrayBuffer | null = null;

async function loadInterFont(): Promise<ArrayBuffer> {
	if (fontCache) return fontCache;

	// Request a subset with the characters we'll actually render.
	// The `text` param makes Google Fonts return a small, self-contained font file.
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:%·/()-';
	const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@600&text=${encodeURIComponent(chars)}`;
	const css = await (await fetch(cssUrl)).text();

	// Google Fonts serves different formats depending on the request.
	// Try truetype/opentype first (best satori compat), then woff, then any URL.
	let match = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/);
	if (!match) match = css.match(/src: url\(([^)]+)\) format\('woff'\)/);
	if (!match) match = css.match(/src: url\(([^)]+)\)/);

	if (!match) {
		throw new Error('Failed to parse font URL from Google Fonts CSS');
	}

	const res = await fetch(match[1]);
	if (!res.ok) throw new Error(`Failed to fetch font file: ${res.status}`);

	fontCache = await res.arrayBuffer();
	return fontCache;
}

// ---------------------------------------------------------------------------
// SVG doughnut chart generator
// ---------------------------------------------------------------------------

function generateDoughnutSvg(
	data: { voiceId: string; count: number }[],
	size: number = 280
): string {
	const cx = size / 2;
	const cy = size / 2;
	const outerR = size * 0.44;
	const innerR = size * 0.27;
	const total = data.reduce((sum, d) => sum + d.count, 0);

	if (total === 0) {
		// Empty state: subtle grey ring
		return [
			`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
			`<circle cx="${cx}" cy="${cy}" r="${(outerR + innerR) / 2}" fill="none" stroke="#374151" stroke-width="${outerR - innerR}" />`,
			'</svg>'
		].join('');
	}

	let angle = -Math.PI / 2; // start from 12 o'clock
	const gap = data.length > 1 ? 0.03 : 0; // small gap between slices

	const paths = data.map((d, i) => {
		const sliceAngle = (d.count / total) * 2 * Math.PI;
		const startAngle = angle + gap / 2;
		const endAngle = angle + sliceAngle - gap / 2;

		// Outer arc
		const ox1 = cx + outerR * Math.cos(startAngle);
		const oy1 = cy + outerR * Math.sin(startAngle);
		const ox2 = cx + outerR * Math.cos(endAngle);
		const oy2 = cy + outerR * Math.sin(endAngle);

		// Inner arc (reversed direction)
		const ix1 = cx + innerR * Math.cos(endAngle);
		const iy1 = cy + innerR * Math.sin(endAngle);
		const ix2 = cx + innerR * Math.cos(startAngle);
		const iy2 = cy + innerR * Math.sin(startAngle);

		const largeArc = sliceAngle - gap > Math.PI ? 1 : 0;

		const pathData = [
			`M ${ox1.toFixed(2)} ${oy1.toFixed(2)}`,
			`A ${outerR.toFixed(2)} ${outerR.toFixed(2)} 0 ${largeArc} 1 ${ox2.toFixed(2)} ${oy2.toFixed(2)}`,
			`L ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
			`A ${innerR.toFixed(2)} ${innerR.toFixed(2)} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
			'Z'
		].join(' ');

		angle += sliceAngle;
		return `<path d="${pathData}" fill="${palette[i % palette.length]}" />`;
	});

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
		...paths,
		'</svg>'
	].join('');
}

// ---------------------------------------------------------------------------
// Satori element tree helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function el(
	type: string,
	style: Record<string, unknown>,
	children?: unknown
): Record<string, unknown> {
	return { type, props: { style, children } };
}

function statBlock(label: string, value: string) {
	return el('div', { display: 'flex', flexDirection: 'column', gap: '4px' }, [
		el(
			'span',
			{
				fontSize: '13px',
				color: '#4B5563',
				textTransform: 'uppercase',
				letterSpacing: '0.06em'
			},
			label
		),
		el('span', { fontSize: '28px', fontWeight: 600, color: '#F9FAFB' }, value)
	]);
}

function buildImageTree(
	voiceData: { voiceId: string; count: number }[],
	stats: { pageviews: number; messagesSent: number; followupClicks: number },
	doughnutDataUri: string
) {
	const total = voiceData.reduce((sum, v) => sum + v.count, 0);
	const followupRate =
		stats.messagesSent > 0
			? Math.round((stats.followupClicks / stats.messagesSent) * 100)
			: 0;

	// Legend rows for each voice
	const legendRows = voiceData.map((v, i) =>
		el('div', { display: 'flex', alignItems: 'center', gap: '14px' }, [
			el('div', {
				width: '16px',
				height: '16px',
				borderRadius: '4px',
				backgroundColor: palette[i % palette.length],
				flexShrink: 0
			}),
			el(
				'span',
				{ fontSize: '22px', color: '#E5E7EB', flexGrow: 1 },
				voiceNames[v.voiceId] ?? v.voiceId
			),
			el(
				'span',
				{ fontSize: '22px', color: '#6B7280' },
				total > 0 ? `${Math.round((v.count / total) * 100)}%` : '–'
			)
		])
	);

	return el(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			height: '100%',
			fontFamily: 'Inter',
			color: 'white',
			background: 'linear-gradient(145deg, #0c0c18 0%, #111127 40%, #0c0c18 100%)'
		},
		[
			// Gradient accent strip at top
			el('div', {
				width: '100%',
				height: '4px',
				background: 'linear-gradient(90deg, #8B5CF6, #34D399, #8B5CF6)',
				flexShrink: 0
			}),

			// Content wrapper
			el(
				'div',
				{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					padding: '44px 60px 40px 60px'
				},
				[
					// --- Header ---
					el(
						'div',
						{
							display: 'flex',
							alignItems: 'center',
							gap: '14px',
							marginBottom: '36px'
						},
						[
							el('div', {
								width: '10px',
								height: '10px',
								borderRadius: '50%',
								backgroundColor: '#34D399'
							}),
							el(
								'span',
								{ fontSize: '24px', fontWeight: 600, color: '#8B5CF6' },
								'josh-bot'
							),
							el('span', { fontSize: '24px', color: '#374151' }, '/'),
							el(
								'span',
								{ fontSize: '24px', fontWeight: 600, color: '#9CA3AF' },
								'Usage Analytics'
							),
							el(
								'span',
								{ fontSize: '16px', color: '#4B5563', marginLeft: 'auto' },
								'Last 30 days'
							)
						]
					),

					// --- Main content: chart + legend ---
					el(
						'div',
						{
							display: 'flex',
							flexGrow: 1,
							gap: '60px',
							alignItems: 'center'
						},
						[
							// Doughnut chart
							{
								type: 'img',
								props: {
									src: doughnutDataUri,
									width: 280,
									height: 280,
									style: { flexShrink: 0 }
								}
							},

							// Legend column
							el(
								'div',
								{
									display: 'flex',
									flexDirection: 'column',
									gap: '14px',
									flexGrow: 1
								},
								[
									el(
										'div',
										{
											fontSize: '15px',
											fontWeight: 600,
											color: '#6B7280',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											marginBottom: '6px'
										},
										'Voice Distribution'
									),
									...legendRows
								]
							)
						]
					),

					// --- Footer stats ---
					el(
						'div',
						{
							display: 'flex',
							gap: '48px',
							marginTop: '28px',
							paddingTop: '22px',
							borderTop: '1px solid rgba(255, 255, 255, 0.06)'
						},
						[
							statBlock('Pageviews', formatNumber(stats.pageviews)),
							statBlock('Messages', formatNumber(stats.messagesSent)),
							statBlock('Follow-up Rate', `${followupRate}%`)
						]
					)
				]
			)
		]
	);
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export const GET: RequestHandler = async () => {
	// Fetch analytics data (uses in-memory cache from shared module)
	let voiceData: { voiceId: string; count: number }[] = [];
	let stats = { pageviews: 0, messagesSent: 0, followupClicks: 0 };

	if (env.POSTHOG_PERSONAL_API_KEY && env.POSTHOG_PROJECT_ID) {
		try {
			const data = await fetchAnalyticsData();
			voiceData = data.voiceDistribution;
			stats = {
				pageviews: data.stats.pageviews,
				messagesSent: data.stats.messagesSent,
				followupClicks: data.stats.followupClicks
			};
		} catch (err) {
			console.error('[og] Failed to load analytics data:', err);
		}
	}

	// Generate the doughnut chart SVG and convert to data URI
	const doughnutSvg = generateDoughnutSvg(voiceData);
	const doughnutDataUri = `data:image/svg+xml,${encodeURIComponent(doughnutSvg)}`;

	// Build the satori element tree
	const element = buildImageTree(voiceData, stats, doughnutDataUri);

	// Load font
	const fontData = await loadInterFont();

	// Render to SVG via satori
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const svg = await satori(element as any, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Inter',
				data: fontData,
				weight: 600,
				style: 'normal'
			}
		]
	});

	// Rasterise to PNG via resvg
	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();

	// The URL slug handles cache busting, so the image itself can be cached aggressively
	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable'
		}
	});
};
