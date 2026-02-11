import type { ResponseSource, MessageMetadata } from '$lib/types';

// ---------------------------------------------------------------------------
// Mailto helpers
// ---------------------------------------------------------------------------

export function getReachOutMailtoLink(): string {
	const subject = encodeURIComponent('Reaching out from josh-bot');
	const body = encodeURIComponent(
		"Hi Josh,\n\nI was exploring josh-bot and wanted to reach out directly.\n\n"
	);
	return `mailto:the.josh.myers@gmail.com?subject=${subject}&body=${body}`;
}

export function getMailtoLink(question: string): string {
	const subject = encodeURIComponent('Question from josh-bot');
	const body = encodeURIComponent(
		`Hi Josh,\n\nI was chatting with your bot and had a question it couldn't fully answer:\n\n"${question}"\n\nWould love to hear your thoughts.\n\nThanks!`
	);
	return `mailto:the.josh.myers@gmail.com?subject=${subject}&body=${body}`;
}

// ---------------------------------------------------------------------------
// Metadata generation
// ---------------------------------------------------------------------------

export function generateMetadata(
	source: ResponseSource,
	responseLength: number,
	latencyMs: number
): MessageMetadata {
	switch (source) {
		case 'llm-stream':
			return {
				tokens: Math.max(1, Math.round(responseLength / 4 + (Math.random() - 0.5) * 20)),
				latency: latencyMs
			};
		case 'llm-unavailable':
		case 'error':
		case 'rate-limit':
		default:
			return {
				tokens: 0,
				latency: latencyMs
			};
	}
}
