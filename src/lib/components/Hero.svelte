<script lang="ts">
	function scrollToChat() {
		document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
	<!-- Background gradient orbs -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute -top-40 -right-32 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-float"
		></div>
		<div
			class="absolute -bottom-40 -left-32 w-[450px] h-[450px] bg-cyan-600/15 rounded-full blur-[120px] animate-float"
			style="animation-delay: -3s;"
		></div>
		<div
			class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[100px]"
		></div>
		<!-- Grid overlay -->
		<div
			class="absolute inset-0 opacity-[0.03]"
			style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
		<!-- Badge -->
		<div
			class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-violet-300 mb-8 animate-fade-in"
		>
			<span class="text-violet-400">&#10022;</span>
			<span>Introducing josh-4o</span>
		</div>

		<!-- Headline -->
		<h1 class="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
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
			<span class="text-xl">&rarr;</span>
		</button>

		<!-- Fake testimonial -->
		<p
			class="mt-16 text-sm text-gray-600 animate-fade-in"
			style="animation-delay: 0.3s;"
		>
			"Finally, AI that does less." &mdash; &#9733;&#9733;&#9733;&#9733;&#9733; (1 review)
		</p>
	</div>
</section>
