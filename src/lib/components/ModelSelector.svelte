<script lang="ts">
	import type { Model } from '$lib/types';

	let {
		models,
		selected,
		onSelect
	}: {
		models: Model[];
		selected: Model;
		onSelect: (model: Model) => void;
	} = $props();

	let isOpen = $state(false);

	function handleSelect(model: Model) {
		onSelect(model);
		isOpen = false;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.model-selector')) {
			isOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="model-selector relative">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-label="Select model: {selected.name}"
	>
		<span class="text-white">{selected.name}</span>
		<svg
			class="w-4 h-4 text-gray-400 transition-transform duration-200"
			class:rotate-180={isOpen}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full left-0 mt-2 w-72 border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/50 animate-fade-in z-50 model-dropdown"
			role="listbox"
			aria-label="Available models"
		>
			{#each models as model}
				<button
					onclick={() => handleSelect(model)}
					class="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left {selected.id === model.id ? 'bg-white/5' : ''}"
					role="option"
					aria-selected={selected.id === model.id}
				>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-white">{model.name}</span>
							{#if model.badge}
								<span
									class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300"
								>
									{model.badge}
								</span>
							{/if}
						</div>
						<p class="text-xs text-gray-500 mt-0.5">{model.description}</p>
					</div>
					{#if selected.id === model.id}
						<svg
							class="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.model-dropdown {
		background-color: rgba(22, 22, 37, 0.95);
		-webkit-backdrop-filter: blur(24px);
		backdrop-filter: blur(24px);
	}
</style>
