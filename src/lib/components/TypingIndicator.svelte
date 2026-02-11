<script lang="ts">
	let { voiceName }: { voiceName: string } = $props();
</script>

<div class="flex gap-3 animate-slide-up">
	<div
		class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5 select-none"
	>
		j
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
