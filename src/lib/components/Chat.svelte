<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { createChatState } from '$lib/chat/state.svelte';
	import VoiceCards from './VoiceCards.svelte';
	import VoiceBar from './VoiceBar.svelte';
	import ChatMessageComponent from './ChatMessage.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	import FollowUpPills from './FollowUpPills.svelte';
	import AskJoshButton from './AskJoshButton.svelte';
	import ChatInput from './ChatInput.svelte';

	let messagesContainer: HTMLElement;
	let chatSection: HTMLElement;
	let chatInput: ChatInput;

	async function scrollToBottom() {
		await tick();
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

	const chat = createChatState({
		scrollToBottom,
		resetTextareaHeight: () => chatInput?.resetHeight()
	});

	onMount(() => {
		chat.initChat();
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
		<!-- Voice cards: wider than chat column, shown before conversation starts -->
		{#if chat.messages.length <= 1 && !chat.selectedPersona}
			<div class="max-w-4xl mx-auto mb-8 px-2">
				<VoiceCards voices={chat.voices} selected={chat.selectedVoice} onSelect={chat.handleVoiceChange} />
			</div>
		{/if}

		<div class="max-w-2xl mx-auto space-y-6">
			{#each chat.messages as message, i (message.id)}
				{@const prevMessage = i > 0 ? chat.messages[i - 1] : null}
				{@const showTimestamp = prevMessage && (message.timestamp - prevMessage.timestamp > 120000)}
				{#if showTimestamp}
					<div class="flex justify-center py-2" aria-hidden="true">
						<span class="text-[11px] text-gray-600 bg-surface-50/50 px-3 py-1 rounded-full">
							{new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
						</span>
					</div>
				{/if}
				<ChatMessageComponent {message} voiceName={message.voiceName ?? chat.selectedVoice.name} voiceId={message.voiceId ?? chat.selectedVoice.id} />
			{/each}

			{#if chat.isTyping}
				<TypingIndicator voiceName={chat.selectedVoice.name} voiceId={chat.selectedVoice.id} />
			{/if}
		</div>
	</div>

	<FollowUpPills
		selectedPersona={chat.selectedPersona}
		messages={chat.messages}
		isTyping={chat.isTyping}
		currentFollowUps={chat.currentFollowUps}
		followUpActionMap={chat.followUpActionMap}
		onPersonaSelect={chat.handlePersonaSelect}
		onSend={(text) => chat.handleSend(text)}
	/>

	<AskJoshButton
		show={chat.showAskJosh}
		lastUserMessage={chat.lastUserMessage}
	/>

	<ChatInput
		bind:this={chatInput}
		bind:inputValue={chat.inputValue}
		isTyping={chat.isTyping}
		disabled={chat.sessionCapped}
		onSend={() => chat.handleSend()}
	>
		{#snippet leftElement()}
			{#if chat.messages.length > 1 || chat.selectedPersona}
				<VoiceBar voices={chat.voices} selected={chat.selectedVoice} onSelect={chat.handleVoiceChange} />
			{/if}
		{/snippet}
	</ChatInput>
</section>

<style>
	.chat-section {
		height: 100vh;
		height: 100dvh;
		box-sizing: border-box;
	}

	/* Smooth scrolling for the messages container on iOS */
	.scroll-smooth {
		-webkit-overflow-scrolling: touch;
	}
</style>
