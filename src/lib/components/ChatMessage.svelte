<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	let {
		message,
		modelName
	}: {
		message: ChatMessage;
		modelName: string;
	} = $props();

	function formatSource(source: string): string {
		switch (source) {
			case 'llm-stream': return 'inference';
			case 'scripted': return 'scripted';
			case 'fallback': return 'fallback';
			case 'rate-limit': return 'rate-limit';
			case 'error': return 'error';
			default: return source;
		}
	}

	function formatMetadata(msg: ChatMessage): string {
		if (!msg.metadata) return '';
		const source = formatSource(msg.source ?? 'scripted');
		const confidence = (msg.metadata.confidence * 100).toFixed(1);
		const tokens = msg.source === 'llm-stream'
			? `~${msg.metadata.tokens} tokens`
			: `${msg.metadata.tokens} tokens`;
		return `${source} · ${confidence}% confidence · ${tokens}`;
	}
</script>

{#if message.role === 'assistant'}
	<div class="flex gap-3 animate-slide-up group/msg" role="article" aria-label="{modelName} response">
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
			{#if message.metadata}
				<p class="text-[11px] text-gray-600 mt-1.5 select-none opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
					{formatMetadata(message)}
				</p>
			{/if}
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
