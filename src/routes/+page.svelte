<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import About from '$lib/components/About.svelte';
</script>

<svelte:head>
	<title>josh-bot | The world's most advanced Josh model</title>
	<meta
		name="description"
		content="The world's most advanced model for answering questions about one specific guy. Built on 8+ years of experience and an unreasonable number of opinions."
	/>
</svelte:head>

<a
	href="#chat"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
>
	Skip to chat
</a>

<main>
	<Hero />
	<Chat />
	<About />
</main>
