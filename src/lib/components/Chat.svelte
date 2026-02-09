<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { ChatMessage as ChatMessageType } from '$lib/types';
	import { models, defaultModel } from '$lib/data/models';
	import { getGreeting, suggestedPrompts } from '$lib/data/responses';
	import ModelSelector from './ModelSelector.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import TypingIndicator from './TypingIndicator.svelte';

	let selectedModel = $state(defaultModel);
	let messages: ChatMessageType[] = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let showPrompts = $state(true);
	let messagesContainer: HTMLElement;
	let textareaEl: HTMLTextAreaElement;

	function initChat() {
		messages = [
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: getGreeting(selectedModel.id),
				timestamp: Date.now()
			}
		];
		showPrompts = true;
		isTyping = false;
		inputValue = '';
	}

	async function scrollToBottom() {
		await tick();
		if (messagesContainer) {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	}

	async function handleSend(text?: string) {
		const message = text || inputValue.trim();
		if (!message || isTyping) return;

		// Add user message
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: message,
				timestamp: Date.now()
			}
		];

		inputValue = '';
		showPrompts = false;
		isTyping = true;

		// Reset textarea height
		if (textareaEl) {
			textareaEl.style.height = 'auto';
		}

		await scrollToBottom();

		try {
			// Build conversation history for the API (exclude the message we just added —
			// the endpoint receives it separately as `message`)
			const history = messages
				.filter((m) => m.role === 'user' || m.role === 'assistant')
				.slice(0, -1) // exclude the user message we just pushed
				.map((m) => ({ role: m.role, content: m.content }));

			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message,
					modelId: selectedModel.id,
					history
				})
			});

			const data = await res.json();

			isTyping = false;
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: data.response,
					timestamp: Date.now()
				}
			];
		} catch {
			isTyping = false;
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content:
						"Something went wrong reaching my backend. Which is embarrassing, given this is a portfolio site. Try again — or ask Josh directly at the.josh.myers@gmail.com.",
					timestamp: Date.now()
				}
			];
		}

		await scrollToBottom();
	}

	function handleModelChange(model: typeof defaultModel) {
		selectedModel = model;
		initChat();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	function handleInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
	}

	function scrollToAbout() {
		document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		initChat();
	});
</script>

<section id="chat" class="relative min-h-screen flex flex-col bg-surface">
	<!-- Chat header -->
	<div
		class="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl"
	>
		<ModelSelector {models} selected={selectedModel} onSelect={handleModelChange} />
		<button
			onclick={scrollToAbout}
			class="text-sm text-gray-500 hover:text-white transition-colors duration-200"
		>
			About
		</button>
	</div>

	<!-- Messages area -->
	<div bind:this={messagesContainer} class="flex-1 overflow-y-auto px-4 py-8">
		<div class="max-w-2xl mx-auto space-y-6">
			{#each messages as message (message.id)}
				<ChatMessage {message} modelName={selectedModel.name} />
			{/each}

			{#if isTyping}
				<TypingIndicator modelName={selectedModel.name} />
			{/if}
		</div>
	</div>

	<!-- Suggested prompts -->
	{#if showPrompts && messages.length <= 1}
		<div class="px-4 pb-3">
			<div class="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center">
				{#each suggestedPrompts as prompt}
					<button
						onclick={() => handleSend(prompt)}
						class="px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
					>
						{prompt}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Input area -->
	<div class="sticky bottom-0 px-4 pt-2 pb-4 bg-gradient-to-t from-surface from-60% to-transparent">
		<div class="max-w-2xl mx-auto">
			<div class="glass rounded-2xl flex items-end gap-2 p-2">
				<textarea
					bind:this={textareaEl}
					bind:value={inputValue}
					onkeydown={handleKeydown}
					oninput={handleInput}
					placeholder="Ask about Josh..."
					rows={1}
					class="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed max-h-32"
				></textarea>
				<button
					onclick={() => handleSend()}
					disabled={!inputValue.trim() || isTyping}
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
					>
						<path d="M22 2L11 13" />
						<path d="M22 2L15 22L11 13L2 9L22 2Z" />
					</svg>
				</button>
			</div>
			<p class="text-center text-[11px] text-gray-600 mt-3">
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
</section>
