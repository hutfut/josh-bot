<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { initPostHog } from '$lib/analytics';

	let { children } = $props();

	$effect(() => {
		initPostHog();
	});
</script>

<Header />
{@render children()}
