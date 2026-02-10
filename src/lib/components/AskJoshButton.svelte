<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getMailtoLink } from '$lib/chat/utils';

	interface Props {
		show: boolean;
		lastUserMessage: string;
	}

	let { show, lastUserMessage }: Props = $props();
</script>

{#if show && lastUserMessage}
	<div class="px-4 pb-2">
		<div class="max-w-2xl mx-auto flex justify-center" in:fly={{ y: 8, duration: 250, delay: 200 }}>
			<a
				href={getMailtoLink(lastUserMessage)}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-300 bg-violet-500/[0.06] border border-violet-500/[0.15] hover:bg-violet-500/[0.12] hover:border-violet-500/[0.25] transition-all duration-200"
				aria-label="Send this question to Josh via email"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect width="20" height="16" x="2" y="4" rx="2" />
					<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
				</svg>
				Ask Josh directly
			</a>
		</div>
	</div>
{/if}
