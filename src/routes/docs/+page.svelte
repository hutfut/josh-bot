<script lang="ts">
	import ApiDocs from '$lib/components/ApiDocs.svelte';
</script>

<svelte:head>
	<title>API Docs | josh-bot</title>
	<meta
		name="description"
		content="josh-bot API documentation: completions, opinions, status, models, and more."
	/>
</svelte:head>

<div class="min-h-screen bg-surface">
	<main class="max-w-4xl mx-auto px-6 pt-24 pb-16 sm:pt-28 sm:pb-24">
		<ApiDocs />
	</main>
</div>
