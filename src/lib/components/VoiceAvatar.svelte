<script lang="ts">
	let {
		voiceId,
		active = false
	}: {
		voiceId: string;
		active?: boolean;
	} = $props();
</script>

<div
	class="voice-avatar w-10 h-10 rounded-full flex items-center justify-center text-lg select-none
		{active ? 'bg-violet-500/20' : 'bg-white/5'}
		{voiceId === 'butler' ? 'avatar-butler' : ''}
		{voiceId === 'engineer' ? 'avatar-engineer' : ''}
		{voiceId === 'spokesperson' ? 'avatar-spokesperson' : ''}
		{voiceId === 'hype' ? 'avatar-hype' : ''}"
	aria-hidden="true"
>
	{#if voiceId === 'butler'}
		<!-- Monocle: dignified slow tilt -->
		<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
			<!-- Monocle lens -->
			<circle cx="12" cy="10" r="6" stroke-width="1.5" class="{active ? 'text-violet-300' : 'text-gray-400'}" />
			<!-- Inner shine -->
			<path d="M9 7.5a4.2 4.2 0 0 1 3-1.5" stroke-width="1" class="{active ? 'text-violet-400/50' : 'text-gray-500/40'}" />
			<!-- Chain hanging down -->
			<path d="M16.5 14.5c1 1.5 1.5 3 1.5 4.5" stroke-width="1.2" class="{active ? 'text-violet-400' : 'text-gray-500'}" />
			<circle cx="18" cy="20" r="0.8" fill="currentColor" class="{active ? 'text-violet-400' : 'text-gray-500'}" stroke="none" />
		</svg>
	{:else if voiceId === 'engineer'}
		<!-- Terminal prompt: blinking cursor -->
		<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<!-- Terminal window -->
			<rect x="3" y="4" width="18" height="16" rx="2" class="{active ? 'text-violet-300' : 'text-gray-400'}" />
			<!-- Title bar dots -->
			<circle cx="6.5" cy="7" r="0.7" fill="currentColor" class="{active ? 'text-red-400' : 'text-gray-500'}" stroke="none" />
			<circle cx="9" cy="7" r="0.7" fill="currentColor" class="{active ? 'text-yellow-400' : 'text-gray-500'}" stroke="none" />
			<circle cx="11.5" cy="7" r="0.7" fill="currentColor" class="{active ? 'text-green-400' : 'text-gray-500'}" stroke="none" />
			<!-- Prompt chevron -->
			<polyline points="7,13 9.5,15 7,17" class="{active ? 'text-violet-400' : 'text-gray-300'}" stroke-width="1.5" />
			<!-- Cursor -->
			<line x1="12" y1="15" x2="15" y2="15" class="avatar-cursor {active ? 'text-violet-300' : 'text-gray-400'}" stroke-width="2" />
		</svg>
	{:else if voiceId === 'spokesperson'}
		<!-- Microphone: smooth pulse -->
		<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<!-- Mic body -->
			<rect x="9" y="3" width="6" height="10" rx="3" class="{active ? 'text-violet-300' : 'text-gray-400'}" />
			<!-- Mic arc -->
			<path d="M5 11a7 7 0 0 0 14 0" class="{active ? 'text-violet-400' : 'text-gray-400'}" />
			<!-- Stand -->
			<line x1="12" y1="18" x2="12" y2="21" class="{active ? 'text-violet-300' : 'text-gray-400'}" />
			<line x1="9" y1="21" x2="15" y2="21" class="{active ? 'text-violet-300' : 'text-gray-400'}" />
			<!-- Sound waves -->
			<path d="M19 8a4 4 0 0 1 0 6" class="avatar-wave wave-1 {active ? 'text-violet-400/60' : 'text-gray-500/40'}" stroke-width="1" />
			<path d="M21 6a7 7 0 0 1 0 10" class="avatar-wave wave-2 {active ? 'text-violet-400/40' : 'text-gray-500/30'}" stroke-width="1" />
		</svg>
	{:else if voiceId === 'hype'}
		<!-- Megaphone / bullhorn: energetic bounce -->
		<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<!-- Megaphone body -->
			<path d="M3 11l6-3v10l-6-3z" class="{active ? 'text-violet-300' : 'text-gray-400'}" fill="{active ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)'}" />
			<path d="M9 8l9-4v16l-9-4" class="{active ? 'text-violet-300' : 'text-gray-400'}" fill="{active ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)'}" />
			<!-- Sound bursts -->
			<line x1="19" y1="10" x2="21" y2="9" class="avatar-burst burst-1 {active ? 'text-yellow-400' : 'text-gray-500'}" stroke-width="2" />
			<line x1="19" y1="12" x2="22" y2="12" class="avatar-burst burst-2 {active ? 'text-yellow-400' : 'text-gray-500'}" stroke-width="2" />
			<line x1="19" y1="14" x2="21" y2="15" class="avatar-burst burst-3 {active ? 'text-yellow-400' : 'text-gray-500'}" stroke-width="2" />
		</svg>
	{/if}
</div>

<style>
	/* Butler: gentle dignified tilt */
	.avatar-butler {
		animation: butler-tilt 4s ease-in-out infinite;
	}
	@keyframes butler-tilt {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(-3deg); }
		75% { transform: rotate(3deg); }
	}

	/* Engineer: blinking cursor */
	.avatar-cursor {
		animation: cursor-blink 1s step-end infinite;
	}
	@keyframes cursor-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	/* Spokesperson: pulsing sound waves */
	.avatar-wave {
		animation: wave-pulse 2s ease-in-out infinite;
	}
	.wave-2 {
		animation-delay: 0.3s;
	}
	@keyframes wave-pulse {
		0%, 100% { opacity: 0.2; }
		50% { opacity: 1; }
	}

	/* Hype Man: energetic bounce + sound bursts */
	.avatar-hype {
		animation: hype-bounce 0.6s ease-in-out infinite;
	}
	@keyframes hype-bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-2px); }
	}

	.avatar-burst {
		animation: burst-pop 0.8s ease-in-out infinite;
	}
	.burst-2 {
		animation-delay: 0.15s;
	}
	.burst-3 {
		animation-delay: 0.3s;
	}
	@keyframes burst-pop {
		0%, 100% { opacity: 0.4; transform: translateX(0); }
		50% { opacity: 1; transform: translateX(2px); }
	}
</style>
