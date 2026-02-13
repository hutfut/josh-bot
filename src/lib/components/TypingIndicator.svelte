<script lang="ts">
	import VoiceAvatar from './VoiceAvatar.svelte';

	let { voiceName, voiceId = 'butler' }: { voiceName: string; voiceId?: string } = $props();
</script>

<div class="flex gap-3 animate-slide-up">
	<div class="flex-shrink-0 mt-0.5 scale-75 origin-top-left">
		<VoiceAvatar {voiceId} active={true} />
	</div>
	<div>
		<p class="text-xs text-gray-500 mb-1.5 font-medium">{voiceName}</p>
		<div class="flex gap-1.5 py-2 px-1">
			<div class="dot"></div>
			<div class="dot" style="animation-delay: 0.2s;"></div>
			<div class="dot" style="animation-delay: 0.4s;"></div>
		</div>
	</div>
</div>

<style>
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #9ca3af;
		animation: typing-bounce 1.4s infinite;
	}

	@keyframes typing-bounce {
		0%,
		60%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		30% {
			opacity: 1;
			transform: translateY(-4px);
		}
	}
</style>
