<script lang="ts">
	import {
		Chart,
		DoughnutController,
		BarController,
		ArcElement,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend
	} from 'chart.js';

	Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

	let { data } = $props();

	// ---------------------------------------------------------------------------
	// Display name maps
	// ---------------------------------------------------------------------------

	const voiceNames: Record<string, string> = {
		butler: 'The Butler',
		engineer: 'The Engineer',
		spokesperson: 'The Spokesperson',
		hype: 'The Hype Man'
	};

	const personaNames: Record<string, string> = {
		recruiter: 'Recruiter',
		engineer: 'Engineer',
		curious: 'Curious'
	};

	// ---------------------------------------------------------------------------
	// Helpers
	// ---------------------------------------------------------------------------

	function ordinal(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	// ---------------------------------------------------------------------------
	// Chart color palette (site-aligned)
	// ---------------------------------------------------------------------------

	const palette = [
		'rgba(139, 92, 246, 0.8)',   // violet
		'rgba(52, 211, 153, 0.8)',   // emerald
		'rgba(251, 191, 36, 0.8)',   // amber
		'rgba(244, 114, 182, 0.8)',  // pink
		'rgba(96, 165, 250, 0.8)',   // blue
		'rgba(248, 113, 113, 0.8)'   // red
	];

	const paletteBorder = [
		'rgba(139, 92, 246, 1)',
		'rgba(52, 211, 153, 1)',
		'rgba(251, 191, 36, 1)',
		'rgba(244, 114, 182, 1)',
		'rgba(96, 165, 250, 1)',
		'rgba(248, 113, 113, 1)'
	];

	// ---------------------------------------------------------------------------
	// Computed stats
	// ---------------------------------------------------------------------------

	const followupRate = $derived(
		data.stats.messagesSent > 0
			? Math.round((data.stats.followupClicks / data.stats.messagesSent) * 100)
			: 0
	);

	// Rough cost estimate: Claude Haiku 4.5 output tokens at $5/M.
	// Input tokens are not tracked, so this is output-only and underestimates total cost.
	const estimatedCost = $derived(
		(data.stats.totalTokens / 1_000_000) * 5
	);

	// ---------------------------------------------------------------------------
	// Chart instances bound via $effect
	// ---------------------------------------------------------------------------

	let pageviewsCanvas: HTMLCanvasElement = $state(null!);
	let voiceCanvas: HTMLCanvasElement = $state(null!);
	let personaCanvas: HTMLCanvasElement = $state(null!);
	let depthCanvas: HTMLCanvasElement = $state(null!);

	// -- Pageviews by route horizontal bar chart --

	$effect(() => {
		if (!pageviewsCanvas || !data.available || data.pageviewsByRoute.length === 0) return;

		const chart = new Chart(pageviewsCanvas, {
			type: 'bar',
			data: {
				labels: data.pageviewsByRoute.map((d) => d.route || '/'),
				datasets: [{
					label: 'Pageviews',
					data: data.pageviewsByRoute.map((d) => d.count),
					backgroundColor: data.pageviewsByRoute.map((_, i, arr) => {
						const opacity = 0.8 - (i / arr.length) * 0.4;
						return `rgba(139, 92, 246, ${opacity})`;
					}),
					borderColor: 'rgba(139, 92, 246, 1)',
					borderWidth: 1,
					borderRadius: 4,
					borderSkipped: false
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						ticks: { color: 'rgba(156, 163, 175, 1)', font: { size: 12 }, precision: 0 },
						grid: { color: 'rgba(255, 255, 255, 0.04)' },
						border: { display: false }
					},
					y: {
						ticks: { color: 'rgba(156, 163, 175, 1)', font: { size: 13 } },
						grid: { display: false },
						border: { display: false }
					}
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: 'rgba(15, 15, 25, 0.95)',
						titleColor: '#fff',
						bodyColor: 'rgba(156, 163, 175, 1)',
						borderColor: 'rgba(255, 255, 255, 0.08)',
						borderWidth: 1
					}
				}
			}
		});

		return () => chart.destroy();
	});

	// -- Voice doughnut chart --

	$effect(() => {
		if (!voiceCanvas || !data.available || data.voiceDistribution.length === 0) return;

		const chart = new Chart(voiceCanvas, {
			type: 'doughnut',
			data: {
				labels: data.voiceDistribution.map((v) => voiceNames[v.voiceId] ?? v.voiceId),
				datasets: [{
					data: data.voiceDistribution.map((v) => v.count),
					backgroundColor: palette.slice(0, data.voiceDistribution.length),
					borderColor: paletteBorder.slice(0, data.voiceDistribution.length),
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { color: 'rgba(156, 163, 175, 1)', padding: 16, font: { size: 13 } }
					},
					tooltip: {
						backgroundColor: 'rgba(15, 15, 25, 0.95)',
						titleColor: '#fff',
						bodyColor: 'rgba(156, 163, 175, 1)',
						borderColor: 'rgba(255, 255, 255, 0.08)',
						borderWidth: 1
					}
				}
			}
		});

		return () => chart.destroy();
	});

	$effect(() => {
		if (!personaCanvas || !data.available || data.personaBreakdown.length === 0) return;

		const chart = new Chart(personaCanvas, {
			type: 'doughnut',
			data: {
				labels: data.personaBreakdown.map((p) => personaNames[p.persona] ?? p.persona),
				datasets: [{
					data: data.personaBreakdown.map((p) => p.count),
					backgroundColor: palette.slice(0, data.personaBreakdown.length),
					borderColor: paletteBorder.slice(0, data.personaBreakdown.length),
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { color: 'rgba(156, 163, 175, 1)', padding: 16, font: { size: 13 } }
					},
					tooltip: {
						backgroundColor: 'rgba(15, 15, 25, 0.95)',
						titleColor: '#fff',
						bodyColor: 'rgba(156, 163, 175, 1)',
						borderColor: 'rgba(255, 255, 255, 0.08)',
						borderWidth: 1
					}
				}
			}
		});

		return () => chart.destroy();
	});

	$effect(() => {
		if (!depthCanvas || !data.available || data.conversationDepth.length === 0) return;

		const chart = new Chart(depthCanvas, {
			type: 'bar',
			data: {
				labels: data.conversationDepth.map((d) => ordinal(d.depth)),
				datasets: [{
					label: 'Users reached',
					data: data.conversationDepth.map((d) => d.count),
					backgroundColor: data.conversationDepth.map((_, i, arr) => {
						const opacity = 0.8 - (i / arr.length) * 0.5;
						return `rgba(139, 92, 246, ${opacity})`;
					}),
					borderColor: 'rgba(139, 92, 246, 1)',
					borderWidth: 1,
					borderRadius: 4,
					borderSkipped: false
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: { display: true, text: 'Messages sent', color: 'rgba(107, 114, 128, 1)', font: { size: 11 } },
						ticks: { color: 'rgba(156, 163, 175, 1)', font: { size: 12 } },
						grid: { color: 'rgba(255, 255, 255, 0.04)' },
						border: { display: false }
					},
					y: {
						title: { display: true, text: 'Message #', color: 'rgba(107, 114, 128, 1)', font: { size: 11 } },
						ticks: { color: 'rgba(156, 163, 175, 1)', font: { size: 12 } },
						grid: { display: false },
						border: { display: false }
					}
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: 'rgba(15, 15, 25, 0.95)',
						titleColor: '#fff',
						bodyColor: 'rgba(156, 163, 175, 1)',
						borderColor: 'rgba(255, 255, 255, 0.08)',
						borderWidth: 1,
						callbacks: {
							title: (items) => `${items[0].label} message`,
							label: (item) => ` ${item.formattedValue} users reached this depth`
						}
					}
				}
			}
		});

		return () => chart.destroy();
	});
</script>

<svelte:head>
	<title>Usage Analytics | josh-bot</title>
	<meta
		name="description"
		content="Real usage data for josh-bot: voice distribution, conversation depth, and follow-up engagement."
	/>
</svelte:head>

<div class="min-h-screen bg-surface">
	<main class="max-w-5xl mx-auto px-6 pt-24 pb-16 sm:pt-28 sm:pb-24">
		<!-- Title section -->
		<div class="mb-12 animate-fade-in">
			<div
				class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-violet-300 mb-6"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
				Last 30 days
			</div>
			<h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">Usage Analytics</h1>
			<p class="text-lg text-gray-400 max-w-xl">
				Real usage data. No vanity metrics. Just proof that people actually use this thing.
			</p>
		</div>

		<!-- Product engineering rationale -->
		<div class="mb-12 animate-fade-in" style="animation-delay: 0.06s;">
			<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-5">
				<h2 class="text-sm font-semibold text-violet-300 uppercase tracking-wide mb-3">Why track this</h2>
				<p class="text-sm text-gray-400 leading-relaxed">
					Product engineers ship features and measure whether they worked. This dashboard tracks
					the signals that matter for this site: which voices resonate, how deep conversations go,
					and whether follow-up suggestions actually get clicked. Every metric here ties to a
					decision about what to build or change next.
				</p>
			</div>
		</div>

		{#if !data.available}
			<!-- No data state -->
			<div class="text-center py-20 animate-fade-in" style="animation-delay: 0.12s;">
				<p class="text-gray-500 text-lg">Analytics data is not available.</p>
				<p class="text-gray-600 text-sm mt-2">PostHog credentials are not configured in this environment.</p>
			</div>
		{:else}
			<!-- Stat cards -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in" style="animation-delay: 0.12s;">
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Pageviews</p>
					<p class="text-3xl font-bold text-white">{data.stats.pageviews.toLocaleString()}</p>
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Messages Sent</p>
					<p class="text-3xl font-bold text-white">{data.stats.messagesSent.toLocaleString()}</p>
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Follow-up Click Rate</p>
					<p class="text-3xl font-bold text-white">{followupRate}%</p>
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Sessions Capped</p>
					<p class="text-3xl font-bold text-white">{data.stats.sessionsCapped.toLocaleString()}</p>
				</div>
			</div>

			<!-- Token usage cards -->
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12 animate-fade-in" style="animation-delay: 0.15s;">
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Output Tokens</p>
					<p class="text-3xl font-bold text-white">{data.stats.totalTokens.toLocaleString()}</p>
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Avg Tokens / Response</p>
					<p class="text-3xl font-bold text-white">{data.stats.avgTokensPerResponse}</p>
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
					<p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Est. Cost (output only)</p>
					<p class="text-3xl font-bold text-white">${estimatedCost < 0.01 ? '<0.01' : estimatedCost.toFixed(2)}</p>
					<p class="text-[10px] text-gray-600 mt-1">Haiku 4.5 @ $5/M output tokens</p>
				</div>
			</div>

			<!-- Pageviews by route -->
			<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 mb-12 animate-fade-in" style="animation-delay: 0.18s;">
				<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">Pageviews by Route</h3>
				<p class="text-xs text-gray-500 mb-4">Which pages are visitors actually looking at?</p>
				{#if data.pageviewsByRoute.length > 0}
					<div style="height: {Math.max(200, data.pageviewsByRoute.length * 36)}px;">
						<canvas bind:this={pageviewsCanvas}></canvas>
					</div>
				{:else}
					<p class="text-gray-600 text-sm text-center py-8">No pageview data yet.</p>
				{/if}
			</div>

			<!-- Doughnut charts: voice + persona side by side -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-fade-in" style="animation-delay: 0.18s;">
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
					<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">Voice Distribution</h3>
					{#if data.voiceDistribution.length > 0}
						<div class="max-w-[280px] mx-auto">
							<canvas bind:this={voiceCanvas}></canvas>
						</div>
					{:else}
						<p class="text-gray-600 text-sm text-center py-8">No voice selection data yet.</p>
					{/if}
				</div>
				<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
					<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">Persona Breakdown</h3>
					{#if data.personaBreakdown.length > 0}
						<div class="max-w-[280px] mx-auto">
							<canvas bind:this={personaCanvas}></canvas>
						</div>
					{:else}
						<p class="text-gray-600 text-sm text-center py-8">No persona selection data yet.</p>
					{/if}
				</div>
			</div>

			<!-- Conversation depth bar chart -->
			<div class="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 mb-12 animate-fade-in" style="animation-delay: 0.24s;">
				<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">Conversation Depth</h3>
				<p class="text-xs text-gray-500 mb-4">How deep do conversations go? Each bar shows how many users sent an Nth message.</p>
				{#if data.conversationDepth.length > 0}
					<div class="max-w-3xl" style="height: {Math.max(200, data.conversationDepth.length * 32)}px;">
						<canvas bind:this={depthCanvas}></canvas>
					</div>
				{:else}
					<p class="text-gray-600 text-sm text-center py-8">No conversation data yet.</p>
				{/if}
			</div>
		{/if}

		<!-- Footer -->
		<div class="mt-16 pt-8 border-t border-white/[0.06] text-center space-y-2">
			<p class="text-xs text-gray-500">
				Data queried from PostHog via HogQL. Dashboard is public. You can look, but you can't touch.
			</p>
			<p class="text-xs text-gray-600">
				Ad blockers and browser tracking protection will prevent analytics from being collected. Numbers here likely undercount actual usage.
			</p>
		</div>
	</main>
</div>
