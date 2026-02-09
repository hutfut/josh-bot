export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
}

export interface Model {
	id: string;
	name: string;
	description: string;
	badge?: string;
	comingSoon?: boolean;
}
