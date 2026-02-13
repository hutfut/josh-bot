export type ResponseSource = 'llm-stream' | 'llm-unavailable' | 'error' | 'rate-limit';

export type Persona = 'recruiter' | 'engineer' | 'curious';

export interface MessageMetadata {
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
	voiceName?: string;
	voiceId?: string;
}

export interface ActionPill {
	type: 'email' | 'navigate';
	href: string;
}

export interface Voice {
	id: string;
	name: string;
	description: string;
	badge?: string;
	preview: string;
}
