<script lang="ts">
	import { tick } from 'svelte';
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

	let containerEl = $state<HTMLDivElement | null>(null);
	let rowEl = $state<HTMLDivElement | null>(null);
	let scale = $state(1);
	let scaledWidth = $state<number | null>(null);
	let scaledHeight = $state<number | null>(null);

	function measureScale() {
		afterTick(() => {
			// Wait for layout/paint so scrollWidth and offsetHeight are correct
			requestAnimationFrame(() => {
				const container = containerEl;
				const row = rowEl;
				if (!container || !row) return;
				const containerWidth = container.clientWidth - 8; // small gutter
				const rowWidth = row.scrollWidth;
				const rowHeight = row.offsetHeight;
				if (rowWidth > containerWidth && containerWidth > 0) {
					const s = Math.min(1, Math.max(0.5, containerWidth / rowWidth));
					scale = s;
					scaledWidth = rowWidth * s;
					scaledHeight = rowHeight * s;
				} else {
					scale = 1;
					scaledWidth = null;
					scaledHeight = null;
				}
			});
		});
	}

	async function afterTick(fn: () => void) {
		await tick();
		fn();
	}

	$effect(() => {
		// Re-run when visibility, content, or refs change
		const _ = showPersonaPills ? 1 : 0;
		const __ = showFollowUps ? currentFollowUps.length : 0;
		const c = containerEl;
		const r = rowEl;
		if (c && r) measureScale();
	});

	$effect(() => {
		if (!containerEl) return;
		const el = containerEl;
		const ro = new ResizeObserver(() => measureScale());
		ro.observe(el);
		return () => ro.disconnect();
	});
</script>

{#if showPersonaPills}
	<!-- Persona selection pills (shown before persona is chosen) -->
	<div class="px-4 pb-3">
		<div
			class="pill-scale-container max-w-2xl mx-auto"
			bind:this={containerEl}
			role="group"
			aria-label="What brings you here?"
		>
			<div
				class="pill-scale-wrapper"
				style={scaledWidth != null && scaledHeight != null ? `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow: hidden; margin: 0 auto;` : ''}
			>
				<div
					class="pill-row flex flex-nowrap gap-2 w-max px-1 pb-1"
					bind:this={rowEl}
					style="transform-origin: 0 0; transform: scale({scale});"
				>
					{#each Object.entries(personaLabels) as [persona, label], i}
						<button
							in:fly={{ y: 8, duration: 200, delay: i * 80 }}
							onclick={() => onPersonaSelect(persona as Persona)}
							class="pill px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 whitespace-nowrap"
						>
							{label}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else if showFollowUps}
	<!-- Contextual follow-up prompts -->
	<div class="px-4 pb-3">
		<div
			class="pill-scale-container max-w-2xl mx-auto"
			bind:this={containerEl}
			role="group"
			aria-label="Follow-up questions"
		>
			<div
				class="pill-scale-wrapper"
				style={scaledWidth != null && scaledHeight != null ? `width: ${scaledWidth}px; height: ${scaledHeight}px; overflow: hidden; margin: 0 auto;` : ''}
			>
				<div
					class="pill-row flex flex-nowrap gap-2 w-max px-1 pb-1"
					bind:this={rowEl}
					style="transform-origin: 0 0; transform: scale({scale});"
				>
					{#each currentFollowUps as prompt, i (prompt)}
						{@const category = followUpCategoryMap.get(prompt)}
						{@const action = followUpActionMap.get(prompt)}
						{#if action}
							<a
								in:fly={{ y: 8, duration: 200, delay: i * 80 }}
								href={action.href}
								target={action.type === 'navigate' ? '_blank' : undefined}
								rel={action.type === 'navigate' ? 'noopener noreferrer' : undefined}
								class="pill inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-violet-300 bg-violet-500/[0.06] border border-violet-500/[0.15] hover:bg-violet-500/[0.12] hover:border-violet-500/[0.25] transition-all duration-200 whitespace-nowrap"
							>
								{#if action.type === 'email'}
									<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
								{:else}
									<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
								{/if}
								{prompt}
							</a>
						{:else}
							<button
								in:fly={{ y: 8, duration: 200, delay: i * 80 }}
								onclick={() => category ? onPillClick(prompt, category) : onSend(prompt)}
								class="pill px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 whitespace-nowrap"
							>
								{prompt}
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Scale wrapper: height is set by JS when row is scaled so layout doesn’t leave a gap */
	.pill-scale-wrapper {
		line-height: 0;
	}
</style>
