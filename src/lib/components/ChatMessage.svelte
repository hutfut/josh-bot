<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	let {
		message,
		modelName
	}: {
		message: ChatMessage;
		modelName: string;
	} = $props();
</script>

{#if message.role === 'assistant'}
	<div class="flex gap-3 animate-slide-up" role="article" aria-label="{modelName} response">
		<div
			class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5 select-none"
			aria-hidden="true"
		>
			j
		</div>
		<div class="flex-1 min-w-0">
			<p class="text-xs text-gray-500 mb-1.5 font-medium">{modelName}</p>
			<div class="text-[14px] text-gray-200 leading-relaxed whitespace-pre-line">
				{message.content}
			</div>
		</div>
	</div>
{:else}
	<div class="flex justify-end animate-slide-up" role="article" aria-label="Your message">
		<div
			class="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm bg-violet-600/20 border border-violet-500/10 text-[14px] text-gray-100 leading-relaxed"
		>
			{message.content}
		</div>
	</div>
{/if}
