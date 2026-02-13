<script lang="ts">
	import type { Voice } from '$lib/types';
	import VoiceAvatar from './VoiceAvatar.svelte';

	let {
		voices,
		selected,
		onSelect
	}: {
		voices: Voice[];
		selected: Voice;
		onSelect: (voice: Voice) => void;
	} = $props();

	let isOpen = $state(false);
	let hasInteracted = $state(false);

	function handleSelect(voice: Voice) {
		onSelect(voice);
		isOpen = false;
		hasInteracted = true;
	}

	function handleToggle() {
		isOpen = !isOpen;
		hasInteracted = true;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.voice-switcher')) {
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

<div class="voice-switcher relative flex-shrink-0 self-center">
	<!-- Trigger button: current voice avatar with animated ring -->
	<button
		onclick={handleToggle}
		class="trigger-btn relative flex items-center justify-center rounded-full transition-all duration-200
			{isOpen ? 'ring-2 ring-violet-500/50' : ''}"
		aria-label="Switch voice (current: {selected.name})"
		aria-haspopup="true"
		aria-expanded={isOpen}
	>
		<!-- Enticing animated ring (only when not yet interacted) -->
		{#if !hasInteracted}
			<span class="beckoning-ring absolute inset-0 rounded-full"></span>
		{/if}
		<VoiceAvatar voiceId={selected.id} active={true} />
	</button>

	<!-- Expanded voice picker popover (opens upward) -->
	{#if isOpen}
		<div class="voice-popover absolute bottom-full left-0 mb-2 flex flex-col gap-1.5 p-2 rounded-xl border border-white/10 bg-surface/95 backdrop-blur-lg shadow-xl shadow-black/30"
			role="radiogroup"
			aria-label="Switch voice personality"
		>
			{#each voices as voice (voice.id)}
				{@const isActive = selected.id === voice.id}
				<button
					onclick={() => handleSelect(voice)}
					role="radio"
					aria-checked={isActive}
					aria-label={voice.name}
					title="{voice.name}: {voice.description}"
					class="voice-option flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap
						{isActive
							? 'bg-violet-600/20 text-white'
							: 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}"
				>
					<div class="scale-[0.7] origin-center">
						<VoiceAvatar voiceId={voice.id} active={isActive} />
					</div>
					<div class="flex flex-col items-start">
						<span class="text-xs font-medium">{voice.name}</span>
						{#if voice.badge}
							<span class="text-[9px] uppercase tracking-wider {isActive ? 'text-violet-300' : 'text-gray-500'}">{voice.badge}</span>
						{/if}
					</div>
					{#if isActive}
						<svg class="w-3 h-3 text-violet-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Beckoning ring: pulses out to draw attention */
	.beckoning-ring {
		border: 2px solid rgba(139, 92, 246, 0.4);
		animation: beckon 2.5s ease-in-out infinite;
	}

	@keyframes beckon {
		0%, 100% {
			transform: scale(1);
			opacity: 0.6;
			border-color: rgba(139, 92, 246, 0.3);
		}
		50% {
			transform: scale(1.25);
			opacity: 0;
			border-color: rgba(139, 92, 246, 0.5);
		}
	}

	/* Popover enter animation */
	.voice-popover {
		animation: popover-in 0.15s ease-out;
	}

	@keyframes popover-in {
		from {
			opacity: 0;
			transform: translateY(4px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
