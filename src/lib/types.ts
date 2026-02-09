export type ResponseSource = 'scripted' | 'llm-stream' | 'fallback' | 'error' | 'rate-limit';

export interface MessageMetadata {
	confidence: number;
	tokens: number;
	latency: number;
}

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
	source?: ResponseSource;
	metadata?: MessageMetadata;
}

export interface Model {
	id: string;
	name: string;
	description: string;
	badge?: string;
	comingSoon?: boolean;
}
