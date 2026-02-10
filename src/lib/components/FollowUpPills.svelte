<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Persona, ActionPill, ChatMessage } from '$lib/types';
	import { personaLabels } from '$lib/data/responses';

	interface Props {
		selectedPersona: Persona | null;
		messages: ChatMessage[];
		isTyping: boolean;
		currentFollowUps: string[];
		followUpCategoryMap: Map<string, string>;
		followUpActionMap: Map<string, ActionPill>;
		onPersonaSelect: (persona: Persona) => void;
		onPillClick: (prompt: string, category: string) => void;
		onSend: (text: string) => void;
	}

	let {
		selectedPersona,
		messages,
		isTyping,
		currentFollowUps,
		followUpCategoryMap,
		followUpActionMap,
		onPersonaSelect,
		onPillClick,
		onSend
	}: Props = $props();

	let showPersonaPills = $derived(
		!selectedPersona && messages.length <= 1 && !isTyping
	);

	let showFollowUps = $derived(
		currentFollowUps.length > 0 && !isTyping
	);
</script>

{#if showPersonaPills}
	<!-- Persona selection pills (shown before persona is chosen) -->
	<div class="px-4 pb-3">
		<div class="max-w-2xl mx-auto overflow-x-auto scrollbar-hide" role="group" aria-label="What brings you here?">
			<div class="flex gap-2 w-max mx-auto px-1 pb-1">
				{#each Object.entries(personaLabels) as [persona, label], i}
					<button
						in:fly={{ y: 8, duration: 200, delay: i * 80 }}
						onclick={() => onPersonaSelect(persona as Persona)}
						class="px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 whitespace-nowrap"
					>
						{label}
					</button>
				{/each}
			</div>
		</div>
	</div>
{:else if showFollowUps}
	<!-- Contextual follow-up prompts -->
	<div class="px-4 pb-3">
		<div class="max-w-2xl mx-auto overflow-x-auto scrollbar-hide" role="group" aria-label="Follow-up questions">
			<div class="flex gap-2 w-max mx-auto px-1 pb-1">
				{#each currentFollowUps as prompt, i (prompt)}
					{@const category = followUpCategoryMap.get(prompt)}
					{@const action = followUpActionMap.get(prompt)}
					{#if action}
						<a
							in:fly={{ y: 8, duration: 200, delay: i * 80 }}
							href={action.href}
							target={action.type === 'navigate' ? '_blank' : undefined}
							rel={action.type === 'navigate' ? 'noopener noreferrer' : undefined}
							class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-violet-300 bg-violet-500/[0.06] border border-violet-500/[0.15] hover:bg-violet-500/[0.12] hover:border-violet-500/[0.25] transition-all duration-200 whitespace-nowrap"
						>
							{#if action.type === 'email'}
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
							{/if}
							{prompt}
						</a>
					{:else}
						<button
							in:fly={{ y: 8, duration: 200, delay: i * 80 }}
							onclick={() => category ? onPillClick(prompt, category) : onSend(prompt)}
							class="px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 whitespace-nowrap"
						>
							{prompt}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Hide scrollbar on pill containers while keeping scroll functional */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
