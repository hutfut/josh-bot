<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
	<title>josh-bot | The world's most advanced Josh model</title>
	<meta
		name="description"
		content="The world's most advanced model for answering questions about one specific guy. Built on 8+ years of experience and an unreasonable number of opinions."
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://josh-bot.vercel.app" />
	<meta property="og:title" content="josh-bot — The world's most advanced Josh model" />
	<meta
		property="og:description"
		content="The world's most advanced model for answering questions about one specific guy. Built on 8+ years of experience and an unreasonable number of opinions."
	/>
	<meta property="og:image" content="https://josh-bot.vercel.app/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="josh-bot — The world's most advanced model for answering questions about one specific guy." />
	<meta property="og:site_name" content="josh-bot" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="josh-bot — The world's most advanced Josh model" />
	<meta
		name="twitter:description"
		content="The world's most advanced model for answering questions about one specific guy. Built on 8+ years of experience and an unreasonable number of opinions."
	/>
	<meta name="twitter:image" content="https://josh-bot.vercel.app/og-image.png" />
	<meta name="twitter:image:alt" content="josh-bot — The world's most advanced model for answering questions about one specific guy." />

	<!-- Additional SEO -->
	<link rel="canonical" href="https://josh-bot.vercel.app" />
	<meta name="author" content="Josh Myers" />
</svelte:head>

<main>
	<Hero />
	<Features />
	<Testimonials />
	<Chat />
</main>
