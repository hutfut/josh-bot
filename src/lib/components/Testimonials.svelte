<script lang="ts">
	const testimonials = [
		{
			quote: 'I asked it to describe Josh and it just… did. Unsettling accuracy.',
			author: 'Anonymous Recruiter',
			role: 'LinkedIn',
			stars: 5
		},
		{
			quote: 'Replaced our entire HR screening pipeline with this. Saves tens of minutes a year.',
			author: 'Startup Founder',
			role: 'YC W26 (rejected)',
			stars: 5
		},
		{
			quote: 'It told me Josh prefers tabs over spaces. I have never recovered.',
			author: 'Code Reviewer',
			role: 'GitHub',
			stars: 4
		},
		{
			quote: 'Finally, an AI that won\'t pretend to know things it doesn\'t. Very niche market.',
			author: 'Product Manager',
			role: 'Fortune 500',
			stars: 5
		},
		{
			quote: 'I asked about someone else and it just said "I don\'t know them." Respect.',
			author: 'Confused User',
			role: 'The Internet',
			stars: 3
		},
		{
			quote: 'The latency is incredible. It responded before I finished typing. Might be a bug.',
			author: 'QA Engineer',
			role: 'Contract',
			stars: 5
		},
		{
			quote: 'Our team tried to fine-tune it for other people. It refused. Admirable, honestly.',
			author: 'ML Engineer',
			role: 'Research Lab',
			stars: 4
		},
		{
			quote: 'My cat walked across the keyboard and it still gave a coherent answer about Josh.',
			author: 'Remote Worker',
			role: 'Home Office',
			stars: 5
		},
		{
			quote: 'Does exactly what it says. Nothing more. Nothing less. Revolutionary.',
			author: 'Tech Journalist',
			role: 'Substack',
			stars: 5
		},
		{
			quote: 'Asked it for investment advice. It said "I only know about Josh." Saved me thousands.',
			author: 'Day Trader',
			role: 'Reddit',
			stars: 5
		}
	];

	function stars(count: number): string {
		return '★'.repeat(count) + '☆'.repeat(5 - count);
	}
</script>

<section
	class="relative py-20 overflow-hidden select-none"
	aria-label="Testimonials"
>
	<!-- Subtle background -->
	<div class="absolute inset-0 pointer-events-none" aria-hidden="true">
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/[0.04] rounded-full blur-[120px]"
		></div>
	</div>

	<!-- Section heading -->
	<div class="relative z-10 text-center mb-12 px-6">
		<h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
			<span class="gradient-text">What People Are Saying</span>
		</h2>
		<p class="text-sm text-gray-500">Verified reviews from definitely real users</p>
	</div>

	<!-- Marquee row 1 (left to right) -->
	<div class="relative z-10 mb-4" aria-hidden="true">
		<div class="marquee">
			<div class="marquee-content">
				{#each testimonials.slice(0, 5) as t}
					<div class="testimonial-card">
						<div class="text-amber-400/80 text-xs mb-2">{stars(t.stars)}</div>
						<p class="text-sm text-gray-300 leading-relaxed mb-3">"{t.quote}"</p>
						<div class="text-xs text-gray-500">
							<span class="text-gray-400 font-medium">{t.author}</span> · {t.role}
						</div>
					</div>
				{/each}
			</div>
			<!-- Duplicate for seamless loop -->
			<div class="marquee-content" aria-hidden="true">
				{#each testimonials.slice(0, 5) as t}
					<div class="testimonial-card">
						<div class="text-amber-400/80 text-xs mb-2">{stars(t.stars)}</div>
						<p class="text-sm text-gray-300 leading-relaxed mb-3">"{t.quote}"</p>
						<div class="text-xs text-gray-500">
							<span class="text-gray-400 font-medium">{t.author}</span> · {t.role}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Marquee row 2 (right to left) -->
	<div class="relative z-10" aria-hidden="true">
		<div class="marquee marquee-reverse">
			<div class="marquee-content">
				{#each testimonials.slice(5) as t}
					<div class="testimonial-card">
						<div class="text-amber-400/80 text-xs mb-2">{stars(t.stars)}</div>
						<p class="text-sm text-gray-300 leading-relaxed mb-3">"{t.quote}"</p>
						<div class="text-xs text-gray-500">
							<span class="text-gray-400 font-medium">{t.author}</span> · {t.role}
						</div>
					</div>
				{/each}
			</div>
			<!-- Duplicate for seamless loop -->
			<div class="marquee-content" aria-hidden="true">
				{#each testimonials.slice(5) as t}
					<div class="testimonial-card">
						<div class="text-amber-400/80 text-xs mb-2">{stars(t.stars)}</div>
						<p class="text-sm text-gray-300 leading-relaxed mb-3">"{t.quote}"</p>
						<div class="text-xs text-gray-500">
							<span class="text-gray-400 font-medium">{t.author}</span> · {t.role}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Edge fades -->
	<div class="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none"></div>
	<div class="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none"></div>
</section>

<style>
	.marquee {
		display: flex;
		width: max-content;
		animation: marquee-scroll 40s linear infinite;
	}

	.marquee-reverse {
		animation-direction: reverse;
	}

	.marquee-content {
		display: flex;
		gap: 1rem;
		padding-right: 1rem;
	}

	.testimonial-card {
		flex-shrink: 0;
		width: 300px;
		padding: 1.25rem;
		border-radius: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: background 0.2s, border-color 0.2s;
	}

	.testimonial-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.15);
	}

	@keyframes marquee-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Pause on hover for readability */
	.marquee:hover {
		animation-play-state: paused;
	}

	/* Respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}
	}
</style>
