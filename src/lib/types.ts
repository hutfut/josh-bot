export type ResponseSource = 'prebaked' | 'llm-stream' | 'llm-unavailable' | 'error' | 'rate-limit';

export type Persona = 'recruiter' | 'engineer' | 'curious';

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

export interface ActionPill {
	type: 'email' | 'navigate';
	href: string;
}

export interface Model {
	id: string;
	name: string;
	description: string;
	badge?: string;
	comingSoon?: boolean;
}
