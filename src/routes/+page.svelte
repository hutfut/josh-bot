<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
	<title>josh-bot | The world's most advanced Josh model</title>
	<meta
		name="description"
		content="The world's most advanced model for answering questions about one specific guy. Built on 8+ years of experience and an unreasonable number of opinions."
	/>
</svelte:head>

<main>
	<Hero />
	<Chat />
</main>
