import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Core type
// ---------------------------------------------------------------------------

export interface FollowUp {
	prompt: string;
	category: string;
}

// ---------------------------------------------------------------------------
// Topic pills — the full set of curated follow-up topics
// ---------------------------------------------------------------------------

export const topicPills: Record<string, FollowUp> = {
	skills: { prompt: 'What are his skills?', category: 'skills' },
	experience: { prompt: 'Tell me about his experience', category: 'experience' },
	currentRole: { prompt: "What's he doing at Kroger now?", category: 'currentRole' },
	hotTakes: { prompt: 'What are his hot takes?', category: 'hotTakes' },
	hiring: { prompt: 'Is he available for hire?', category: 'hiring' },
	contact: { prompt: 'How do I contact him?', category: 'contact' },
	personality: { prompt: "What's his deal?", category: 'personality' },
	gaming: { prompt: 'What does he do outside work?', category: 'gaming' },
	cat: { prompt: 'Does he have any pets?', category: 'cat' },
	aiTools: { prompt: 'Does he use AI tools?', category: 'aiTools' },
	architecture: { prompt: 'Tell me about system design', category: 'architecture' },
	site: { prompt: 'How was this site built?', category: 'site' },
	education: { prompt: 'How did he get into tech?', category: 'education' },
	careerGoals: { prompt: "What's he looking for next?", category: 'careerGoals' }
};

// ---------------------------------------------------------------------------
// Per-persona topic ordering
// ---------------------------------------------------------------------------
// Determines which pills surface and in what priority. At runtime, already-
// visited categories are filtered out and the next N pills are shown.

export const personaTopicOrder: Record<Persona, string[]> = {
	recruiter: [
		'experience', 'skills', 'currentRole', 'hiring', 'careerGoals',
		'architecture', 'aiTools', 'contact', 'personality', 'hotTakes',
		'education', 'gaming', 'cat', 'site'
	],
	engineer: [
		'skills', 'architecture', 'hotTakes', 'aiTools', 'currentRole',
		'experience', 'site', 'careerGoals', 'personality', 'gaming',
		'education', 'cat', 'hiring', 'contact'
	],
	curious: [
		'personality', 'hotTakes', 'gaming', 'cat', 'education',
		'site', 'aiTools', 'skills', 'experience', 'currentRole',
		'architecture', 'careerGoals', 'hiring', 'contact'
	]
};

// ---------------------------------------------------------------------------
// Initial follow-ups (shown right after persona selection)
// ---------------------------------------------------------------------------

export const personaInitialFollowUps: Record<Persona, string[]> = {
	recruiter: ['experience', 'skills', 'hiring', 'careerGoals'],
	engineer: ['skills', 'architecture', 'hotTakes', 'aiTools'],
	curious: ['personality', 'hotTakes', 'gaming', 'cat']
};

// ---------------------------------------------------------------------------
// Default follow-ups (when no persona is active)
// ---------------------------------------------------------------------------

export const defaultFollowUps: string[] = [
	'skills', 'experience', 'hotTakes', 'cat', 'hiring'
];

// ---------------------------------------------------------------------------
// Action pills — special follow-ups that link out
// ---------------------------------------------------------------------------

/** Categories after which an "Email Josh directly" pill appears */
export const emailPillAfter: Record<Persona, Set<string>> = {
	recruiter: new Set(['hiring', 'careerGoals', 'contact']),
	engineer: new Set(['careerGoals', 'hiring']),
	curious: new Set(['hiring'])
};

/** Categories after which a "Skip to his resume" pill appears */
export const aboutPillAfter: Record<Persona, Set<string>> = {
	recruiter: new Set(['experience', 'skills']),
	engineer: new Set(['skills']),
	curious: new Set([])
};
