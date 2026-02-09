<section
	id="features"
	class="relative py-24 px-4 sm:px-6 overflow-hidden"
	aria-label="Capabilities"
>
	<!-- Background effects -->
	<div class="absolute inset-0 pointer-events-none" aria-hidden="true">
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/[0.06] rounded-full blur-[160px]"
		></div>
	</div>

	<div class="relative z-10 max-w-5xl mx-auto">
		<!-- Section heading -->
		<div class="text-center mb-16 animate-fade-in">
			<h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
				<span class="gradient-text">Capabilities</span>
			</h2>
			<p class="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
				Benchmarked against leading Josh models. Results speak for themselves.
			</p>
		</div>

		<!-- Features grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			{#each features as feature, i}
				<div
					class="group rounded-xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 animate-fade-in"
					style="animation-delay: {0.05 * (i + 1)}s;"
				>
					<p class="text-3xl sm:text-4xl font-bold tracking-tight mb-3 gradient-text">
						{feature.metric}
					</p>
					<p class="text-sm sm:text-base text-gray-400 leading-relaxed">
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<script lang="ts">
	const features = [
		{ metric: '99.7%', description: 'Accuracy on Josh-related queries' },
		{ metric: '<250ms', description: 'Sarcasm response latency' },
		{ metric: '0', description: 'Hallucinations about work ethic (target)' },
		{ metric: '35+', description: 'Pre-trained response patterns' },
		{ metric: '8+ years', description: 'Of high-quality training data' },
		{ metric: '$0', description: 'Venture capital raised' }
	];
</script>
