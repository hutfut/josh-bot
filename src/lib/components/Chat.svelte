<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { ChatMessage as ChatMessageType, ResponseSource, MessageMetadata } from '$lib/types';
	import { models, defaultModel } from '$lib/data/models';
	import {
		getGreeting,
		suggestedPrompts,
		followUpPrompts,
		defaultFollowUps,
		type FollowUp
	} from '$lib/data/responses';
	import ModelSelector from './ModelSelector.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import TypingIndicator from './TypingIndicator.svelte';

	let selectedModel = $state(defaultModel);
	let messages: ChatMessageType[] = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let showPrompts = $state(true);
	let currentFollowUps: string[] = $state([]);
	let visitedCategories: Set<string> = $state(new Set());
	let lastResponseSource: string = $state('');
	let lastUserMessage: string = $state('');
	let messagesContainer: HTMLElement;
	let chatSection: HTMLElement;
	let textareaEl: HTMLTextAreaElement;

	/**
	 * Pick follow-up prompts from a pool, filtering out already-visited categories.
	 * Keeps the golden-path item (index 0) if its category hasn't been visited,
	 * then randomly selects remaining slots from the rest of the pool.
	 */
	function pickFollowUps(pool: FollowUp[], count: number = 3): string[] {
		// Filter out follow-ups whose target category has already been visited
		const available = pool.filter((f) => !visitedCategories.has(f.category));

		if (available.length === 0) {
			// Everything visited — fall back to full pool unfiltered
			const shuffled = [...pool].sort(() => Math.random() - 0.5);
			return shuffled.slice(0, count).map((f) => f.prompt);
		}

		if (available.length <= count) {
			return available.map((f) => f.prompt);
		}

		// Keep the golden-path item (first available from original order) in position 0
		const goldenIdx = pool.findIndex((f) => !visitedCategories.has(f.category));
		const golden = pool[goldenIdx];
		const rest = available.filter((f) => f !== golden);

		// Randomly pick (count - 1) from the rest
		const shuffled = rest.sort(() => Math.random() - 0.5);
		const picked = [golden, ...shuffled.slice(0, count - 1)];
		return picked.map((f) => f.prompt);
	}

	function generateMetadata(source: ResponseSource, responseLength: number, latencyMs: number): MessageMetadata {
		switch (source) {
			case 'scripted':
				return {
					confidence: 0.97 + Math.random() * 0.029,
					tokens: 0,
					latency: latencyMs
				};
			case 'llm-stream':
				return {
					confidence: 0.88 + Math.random() * 0.09,
					tokens: Math.max(1, Math.round(responseLength / 4 + (Math.random() - 0.5) * 20)),
					latency: latencyMs
				};
			case 'fallback':
			case 'error':
			case 'rate-limit':
			default:
				return {
					confidence: 0.0,
					tokens: 0,
					latency: latencyMs
				};
		}
	}

	function setFollowUps(category?: string) {
		if (category) {
			visitedCategories.add(category);
		}
		const pool = category && followUpPrompts[category]
			? followUpPrompts[category]
			: defaultFollowUps;
		currentFollowUps = pickFollowUps(pool);
	}

	function initChat() {
		const greeting = getGreeting(selectedModel.id);
		messages = [
			{
				id: crypto.randomUUID(),
				role: 'assistant',
				content: greeting,
				timestamp: Date.now(),
				source: 'scripted',
				metadata: generateMetadata('scripted', greeting.length, Math.round(8 + Math.random() * 12))
			}
		];
		showPrompts = true;
		currentFollowUps = [];
		visitedCategories = new Set();
		lastResponseSource = '';
		lastUserMessage = '';
		isTyping = false;
		inputValue = '';
	}

	async function scrollToBottom() {
		await tick();
		// Keep the chat section in the viewport when interacting
		if (chatSection) {
			chatSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
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

		// Clear follow-ups while waiting for response
		currentFollowUps = [];

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
		lastResponseSource = '';
		lastUserMessage = message;

		// Reset textarea height
		if (textareaEl) {
			textareaEl.style.height = 'auto';
		}

		await scrollToBottom();

		const requestStartTime = Date.now();

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

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				isTyping = false;
				const source: ResponseSource = data.source ?? 'error';
				lastResponseSource = source;
				const content = data.response ?? 'Something went wrong. Try again.';
				const latency = Date.now() - requestStartTime;
				messages = [
					...messages,
					{
						id: crypto.randomUUID(),
						role: 'assistant',
						content,
						timestamp: Date.now(),
						source,
						metadata: generateMetadata(source, content.length, latency)
					}
				];
				setFollowUps();
			} else if (res.headers.get('X-Response-Source') === 'llm-stream' && res.body) {
				const streamId = crypto.randomUUID();
				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let first = true;
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					if (first) {
						messages = [
							...messages,
							{
								id: streamId,
								role: 'assistant',
								content: chunk,
								timestamp: Date.now(),
								source: 'llm-stream'
							}
						];
						isTyping = false;
						first = false;
						await scrollToBottom();
					} else {
						messages = messages.map((m) =>
							m.id === streamId ? { ...m, content: m.content + chunk } : m
						);
					}
				}
				if (first) {
					isTyping = false;
					const fallbackContent = "I had nothing to add. Try asking something else.";
					const latency = Date.now() - requestStartTime;
					messages = [
						...messages,
						{
							id: streamId,
							role: 'assistant',
							content: fallbackContent,
							timestamp: Date.now(),
							source: 'fallback',
							metadata: generateMetadata('fallback', fallbackContent.length, latency)
						}
					];
				} else {
					// Stream complete — attach metadata to the final message
					const latency = Date.now() - requestStartTime;
					messages = messages.map((m) =>
						m.id === streamId
							? { ...m, metadata: generateMetadata('llm-stream', m.content.length, latency) }
							: m
					);
				}
				lastResponseSource = 'llm-stream';
				setFollowUps(); // LLM response — show default follow-ups
			} else {
				const data = await res.json();
				isTyping = false;
				const source: ResponseSource = data.source ?? 'scripted';
				lastResponseSource = source;
				const latency = Date.now() - requestStartTime;
				messages = [
					...messages,
					{
						id: crypto.randomUUID(),
						role: 'assistant',
						content: data.response,
						timestamp: Date.now(),
						source,
						metadata: generateMetadata(source, data.response.length, latency)
					}
				];
				setFollowUps(data.category); // Scripted response — use category-specific follow-ups
			}
		} catch {
			isTyping = false;
			lastResponseSource = 'error';
			const errorContent = "Something went wrong reaching my backend. Which is embarrassing, given this is a portfolio site. Try again — or ask Josh directly.";
			const latency = Date.now() - requestStartTime;
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: errorContent,
					timestamp: Date.now(),
					source: 'error',
					metadata: generateMetadata('error', errorContent.length, latency)
				}
			];
			setFollowUps();
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

	function getMailtoLink(question: string): string {
		const subject = encodeURIComponent('Question from josh-bot');
		const body = encodeURIComponent(
			`Hi Josh,\n\nI was chatting with your bot and had a question it couldn't fully answer:\n\n"${question}"\n\nWould love to hear your thoughts.\n\nThanks!`
		);
		return `mailto:the.josh.myers@gmail.com?subject=${subject}&body=${body}`;
	}

	/** Whether to show the "Ask Josh Directly" email button */
	let showAskJosh = $derived(
		!isTyping &&
		lastResponseSource !== '' &&
		lastResponseSource !== 'scripted'
	);

	onMount(() => {
		initChat();
	});
</script>

<section
	bind:this={chatSection}
	id="chat"
	class="relative flex flex-col bg-surface chat-section pt-16"
	aria-label="Chat with josh-bot"
>
	<!-- Messages area -->
	<div
		bind:this={messagesContainer}
		class="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
		role="log"
		aria-live="polite"
		aria-label="Conversation messages"
		style="-webkit-overflow-scrolling: touch;"
	>
		<div class="max-w-2xl mx-auto space-y-6">
			<!-- Model selector -->
			<div class="flex justify-center pb-2">
				<div class="flex items-center gap-2">
					<span class="text-xs text-gray-500 uppercase tracking-wider">Model</span>
					<ModelSelector {models} selected={selectedModel} onSelect={handleModelChange} />
				</div>
			</div>
			{#each messages as message, i (message.id)}
				{@const prevMessage = i > 0 ? messages[i - 1] : null}
				{@const showTimestamp = prevMessage && (message.timestamp - prevMessage.timestamp > 120000)}
				{#if showTimestamp}
					<div class="flex justify-center py-2" aria-hidden="true">
						<span class="text-[11px] text-gray-600 bg-surface-50/50 px-3 py-1 rounded-full">
							{new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
						</span>
					</div>
				{/if}
				<ChatMessage {message} modelName={selectedModel.name} />
			{/each}

			{#if isTyping}
				<TypingIndicator modelName={selectedModel.name} />
			{/if}
		</div>
	</div>

	<!-- Suggested prompts / Follow-up prompts -->
	{#if showPrompts && messages.length <= 1}
		<!-- Initial prompts before first message -->
		<div class="px-4 pb-3">
			<div class="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center" role="group" aria-label="Suggested questions">
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
	{:else if currentFollowUps.length > 0 && !isTyping}
		<!-- Contextual follow-up prompts -->
		<div class="px-4 pb-3">
			<div class="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center" role="group" aria-label="Follow-up questions">
				{#each currentFollowUps as prompt, i (prompt)}
					<button
						in:fly={{ y: 8, duration: 200, delay: i * 80 }}
						onclick={() => handleSend(prompt)}
						class="px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
					>
						{prompt}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- "Ask Josh Directly" fallback button -->
	{#if showAskJosh && lastUserMessage}
		<div class="px-4 pb-2">
			<div class="max-w-2xl mx-auto flex justify-center" in:fly={{ y: 8, duration: 250, delay: 200 }}>
				<a
					href={getMailtoLink(lastUserMessage)}
					class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-300 bg-violet-500/[0.06] border border-violet-500/[0.15] hover:bg-violet-500/[0.12] hover:border-violet-500/[0.25] transition-all duration-200"
					aria-label="Send this question to Josh via email"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect width="20" height="16" x="2" y="4" rx="2" />
						<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
					</svg>
					Ask Josh directly
				</a>
			</div>
		</div>
	{/if}

	<!-- Input area -->
	<div class="sticky bottom-0 px-4 pt-2 pb-4 bg-gradient-to-t from-surface from-60% to-transparent chat-input-area">
		<div class="max-w-2xl mx-auto">
			<div class="glass rounded-2xl flex items-end gap-2 p-2">
				<label for="chat-input" class="sr-only">Ask about Josh</label>
				<textarea
					id="chat-input"
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
</section>

<style>
	.chat-section {
		height: 100vh;
		height: 100dvh;
		box-sizing: border-box;
	}

	/* Ensure input stays visible when mobile keyboard is open */
	.chat-input-area {
		padding-bottom: max(1rem, env(safe-area-inset-bottom));
	}

	/* Smooth scrolling for the messages container on iOS */
	.scroll-smooth {
		-webkit-overflow-scrolling: touch;
	}
</style>
