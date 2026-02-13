<script lang="ts">
	import { changelog, type ChangelogNote } from '$lib/data/changelog';

	const typeConfig: Record<ChangelogNote['type'], { label: string; class: string }> = {
		new: { label: 'New', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
		improved: {
			label: 'Improved',
			class: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
		},
		fixed: { label: 'Fixed', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
		removed: { label: 'Removed', class: 'bg-red-500/10 text-red-400 border-red-500/20' }
	};
</script>

<svelte:head>
	<title>Changelog | josh-bot</title>
	<meta
		name="description"
		content="What's new in josh-bot: release notes, improvements, and questionable product decisions."
	/>
</svelte:head>

<div class="min-h-screen bg-surface">
	<!-- Page Content -->
	<main class="max-w-3xl mx-auto px-6 pt-24 pb-16 sm:pt-28 sm:pb-24">
		<!-- Title section -->
		<div class="mb-16 animate-fade-in">
			<div
				class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-violet-300 mb-6"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
				{changelog.length} releases
			</div>
			<h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">Changelog</h1>
			<p class="text-lg text-gray-400 max-w-xl">
				All the latest updates, improvements, and questionable product decisions from the
				josh-bot team (Josh).
			</p>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Timeline line -->
			<div
				class="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/40 via-white/[0.08] to-transparent"
				aria-hidden="true"
			></div>

			<div class="space-y-16">
				{#each changelog as entry, i}
					<article
						class="relative pl-10 animate-fade-in"
						style="animation-delay: {Math.min(i * 0.06, 0.3)}s;"
					>
						<!-- Timeline dot -->
						<div
							class="absolute left-0 top-[6px] w-[15px] h-[15px] rounded-full border-2 {i === 0
								? 'bg-violet-500 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]'
								: 'bg-surface border-white/20'}"
							aria-hidden="true"
						></div>

						<!-- Version + Date header -->
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
							<h2 class="text-xl font-semibold text-white">
								v{entry.version}
							</h2>
							<span class="text-sm text-gray-500">{entry.date}</span>
						</div>

						<!-- Title -->
						<p class="text-base text-gray-300 font-medium mb-5">{entry.title}</p>

						<!-- Notes -->
						<ul class="space-y-3">
							{#each entry.notes as note}
								<li class="flex items-start gap-3 text-sm">
									<span
										class="inline-flex shrink-0 mt-0.5 px-2 py-0.5 rounded text-[11px] font-medium border {typeConfig[
											note.type
										].class}"
									>
										{typeConfig[note.type].label}
									</span>
									<span class="text-gray-400 leading-relaxed">{note.text}</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-20 pt-8 border-t border-white/[0.06] text-center">
			<p class="text-xs text-gray-500">
				That's everything. If you expected more, you may be overestimating the velocity of a
				one-person team.
			</p>
		</div>
	</main>
</div>
