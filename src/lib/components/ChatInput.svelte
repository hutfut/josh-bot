<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		inputValue: string;
		isTyping: boolean;
		disabled?: boolean;
		onSend: () => void;
		leftElement?: Snippet;
	}

	let { inputValue = $bindable(), isTyping, disabled = false, onSend, leftElement }: Props = $props();

	let textareaEl: HTMLTextAreaElement | undefined = $state();

	export function resetHeight() {
		if (textareaEl) {
			textareaEl.style.height = 'auto';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSend();
		}
	}

	function handleInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
	}
</script>

<div class="sticky bottom-0 px-4 pt-2 pb-4 bg-gradient-to-t from-surface from-60% to-transparent chat-input-area">
	<div class="max-w-2xl mx-auto">
		<div class="glass rounded-2xl flex items-end gap-2 p-2">
			{#if leftElement}
				{@render leftElement()}
			{/if}
			<label for="chat-input" class="sr-only">Ask about Josh</label>
			<textarea
				id="chat-input"
				bind:this={textareaEl}
				bind:value={inputValue}
				onkeydown={handleKeydown}
				oninput={handleInput}
				placeholder={disabled ? 'Session limit reached' : 'Ask about Josh...'}
				rows={1}
				{disabled}
				class="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed max-h-32 disabled:opacity-40"
			></textarea>
			<button
				onclick={onSend}
				disabled={!inputValue.trim() || isTyping || disabled}
				aria-label="Send message"
				class="p-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-violet-600 transition-all duration-200 flex-shrink-0"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M22 2L11 13" />
					<path d="M22 2L15 22L11 13L2 9L22 2Z" />
				</svg>
			</button>
		</div>
		<p class="text-center text-[11px] text-gray-500 mt-3">
			Powered by Josh&trade; &middot; Not affiliated with any real AI company &middot;
			<a
				href="https://github.com/hutfut/josh-bot"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-gray-400 transition-colors"
			>
				Source
			</a>
		</p>
	</div>
</div>

<style>
	/* Ensure input stays visible when mobile keyboard is open */
	.chat-input-area {
		padding-bottom: max(1rem, env(safe-area-inset-bottom));
	}
</style>
