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
</script>

<div class="flex flex-col items-center gap-3">
	<p class="text-xs text-gray-500 uppercase tracking-wider">Choose a voice</p>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full" role="radiogroup" aria-label="Select a voice personality">
		{#each voices as voice (voice.id)}
			{@const isSelected = selected.id === voice.id}
			<button
				onclick={() => onSelect(voice)}
				role="radio"
				aria-checked={isSelected}
				aria-label="{voice.name}{voice.badge ? ` (${voice.badge})` : ''}"
				class="voice-card relative flex flex-col items-center gap-2 rounded-xl p-4 md:p-5 text-center transition-all duration-200 cursor-pointer border
					{isSelected
						? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30 shadow-lg shadow-violet-500/10'
						: 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'}"
			>
				<!-- Avatar -->
				<VoiceAvatar voiceId={voice.id} active={isSelected} />

				<!-- Name + badge row -->
				<div class="flex items-center gap-2 flex-wrap justify-center">
					<span class="text-sm font-semibold text-white">{voice.name}</span>
					{#if voice.badge}
						<span
							class="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
								{isSelected ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-gray-400'}"
						>
							{voice.badge}
						</span>
					{/if}
				</div>

				<!-- Description -->
				<p class="text-xs text-gray-400 leading-relaxed">{voice.description}</p>

				<!-- Preview quote -->
				<p class="text-xs italic text-gray-500 leading-relaxed mt-auto">"{voice.preview}"</p>

				<!-- Selected indicator -->
				{#if isSelected}
					<div class="absolute top-2.5 right-2.5">
						<svg class="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
