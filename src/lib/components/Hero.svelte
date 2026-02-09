<script lang="ts">
	function scrollToChat() {
		document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section
	id="hero"
	class="relative min-h-screen min-h-dvh flex items-center justify-center overflow-hidden"
	aria-label="Introduction"
>
	<!-- Background gradient orbs -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
		<div
			class="absolute -top-32 -right-24 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-float"
		></div>
		<div
			class="absolute -bottom-32 -left-24 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-cyan-600/15 rounded-full blur-[120px] animate-float"
			style="animation-delay: -3s;"
		></div>
		<div
			class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-violet-500/10 rounded-full blur-[100px]"
		></div>
		<!-- Subtle secondary orb for depth -->
		<div
			class="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-indigo-500/[0.07] rounded-full blur-[80px] animate-float"
			style="animation-delay: -4.5s;"
		></div>
		<!-- Grid overlay -->
		<div
			class="absolute inset-0 opacity-[0.03]"
			style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"
		></div>
		<!-- Noise texture overlay for visual depth -->
		<div class="absolute inset-0 opacity-[0.015] mix-blend-overlay noise-texture"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
		<!-- Badge -->
		<a
			href="/changelog"
			class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-violet-300 mb-8 animate-fade-in hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200"
		>
			<span class="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
			<span>What's New &mdash; v2.1.0</span>
			<svg
				class="w-3.5 h-3.5 text-gray-500"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</a>

		<!-- Headline -->
		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
			<span class="gradient-text">The world's most advanced model</span>
			<br />
			<span class="text-white/90">for answering questions about</span>
			<br />
			<span class="text-white/90">one specific guy.</span>
		</h1>

		<!-- Subtext -->
		<p
			class="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 animate-fade-in"
			style="animation-delay: 0.1s;"
		>
			Built on 8+ years of experience and an unreasonable number of opinions.
		</p>

		<!-- CTA -->
		<button
			onclick={scrollToChat}
			class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full text-white font-semibold text-lg hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
			style="animation-delay: 0.2s;"
		>
			Try josh-4o
			<span class="text-xl" aria-hidden="true">&rarr;</span>
		</button>

		<!-- Fake testimonial -->
		<p
			class="mt-16 text-sm text-gray-500 animate-fade-in"
			style="animation-delay: 0.3s;"
		>
			"Finally, AI that does less." &mdash; <span aria-label="5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> (1 review)
		</p>
	</div>
</section>

<style>
	.noise-texture {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
	}
</style>
