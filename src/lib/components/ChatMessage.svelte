<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	let {
		message,
		modelName
	}: {
		message: ChatMessage;
		modelName: string;
	} = $props();

	let copied = $state(false);
	let feedback: 'up' | 'down' | null = $state(null);
	let feedbackText = $state('');
	let actionsLocked = $derived(feedback !== null || copied);

	const thumbsDownResponses = [
		'Feedback submitted to /dev/null',
		"Noted. Josh doesn't care.",
		'This response has been flagged for being too honest.',
		'Your complaint has been filed under "Not My Problem".',
		'Acknowledged. Nothing will change.'
	];

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

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(message.content);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		} catch {
			// Clipboard API not available
		}
	}

	function handleThumbsUp() {
		if (feedback) return;
		feedback = 'up';
		feedbackText = 'Noted.';
	}

	function handleThumbsDown() {
		if (feedback) return;
		feedback = 'down';
		feedbackText = thumbsDownResponses[Math.floor(Math.random() * thumbsDownResponses.length)];
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
			<!-- Action buttons: copy, thumbs up, thumbs down -->
			<div class="flex items-center gap-0.5 mt-2 transition-opacity duration-200 {actionsLocked ? '' : 'md:opacity-0 md:group-hover/msg:opacity-100'}">
				<!-- Copy button -->
				<button
					onclick={handleCopy}
					class="p-1 rounded transition-colors duration-150 {copied ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}"
					aria-label={copied ? 'Copied' : 'Copy message'}
				>
					{#if copied}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
					{/if}
				</button>
				<!-- Thumbs up -->
				<button
					onclick={handleThumbsUp}
					disabled={feedback !== null}
					class="p-1 rounded transition-colors duration-150 disabled:cursor-default {feedback === 'up' ? 'text-violet-400' : feedback !== null ? 'text-gray-700' : 'text-gray-600 hover:text-gray-400'}"
					aria-label="Good response"
				>
					{#if feedback === 'up'}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
					{/if}
				</button>
				<!-- Thumbs down -->
				<button
					onclick={handleThumbsDown}
					disabled={feedback !== null}
					class="p-1 rounded transition-colors duration-150 disabled:cursor-default {feedback === 'down' ? 'text-violet-400' : feedback !== null ? 'text-gray-700' : 'text-gray-600 hover:text-gray-400'}"
					aria-label="Bad response"
				>
					{#if feedback === 'down'}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
					{/if}
				</button>
				<!-- Inline feedback text -->
				{#if feedbackText}
					<span class="text-[11px] text-gray-500 ml-1.5 select-none">{feedbackText}</span>
				{/if}
			</div>
			{#if message.metadata}
				<p class="text-[11px] text-gray-600 mt-1 select-none opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
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
