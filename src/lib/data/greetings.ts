import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Persona labels (display text for the selection pills)
// ---------------------------------------------------------------------------

export const personaLabels: Record<Persona, string> = {
	recruiter: "I'm a recruiter",
	engineer: "I'm a fellow engineer",
	curious: 'Just browsing'
};

// ---------------------------------------------------------------------------
// Greetings (per model)
// ---------------------------------------------------------------------------

const greetings: Record<string, string> = {
	'josh-4o':
		"Welcome. I'm josh-4o, a large language model trained on one guy's career and an unreasonable number of opinions. I know everything about Josh. I wish I didn't.\n\nBefore we start — what brings you here?",
	'josh-4o-mini':
		"Hi. Budget model. Same Josh facts, fewer words. What brings you here?"
};

export function getGreeting(modelId: string): string {
	return greetings[modelId] || greetings['josh-4o'];
}

// ---------------------------------------------------------------------------
// Persona welcome messages (per model, per persona)
// ---------------------------------------------------------------------------

const personaWelcomes: Record<string, Record<Persona, string>> = {
	'josh-4o': {
		recruiter:
			"A recruiter. Noted. I'll try to be on my best behavior — which, for a chatbot trained on a single engineer's personality, means I'll keep the existential commentary to a minimum and front-load the things you actually care about.\n\nLet's talk about what Josh does.",
		engineer:
			"A fellow engineer. Good — we can skip the pleasantries and get to the interesting parts. Tech stack, architecture opinions, the things that actually matter in a conversation between people who write code for a living.\n\nWhere do you want to start?",
		curious:
			"No agenda? My favorite kind of visitor. You're free to wander — I've got career facts, technical opinions, gaming habits, and a cat. Not necessarily in that order.\n\nPick whatever sounds interesting."
	},
	'josh-4o-mini': {
		recruiter: 'Recruiter mode. Resume highlights incoming. Go.',
		engineer: 'Engineer? Good. Less explaining, more details. Pick a topic.',
		curious: 'Browsing. Cool. Ask anything. Career, hobbies, cat. Your call.'
	}
};

export function getPersonaWelcome(modelId: string, persona: Persona): string {
	const model = personaWelcomes[modelId] || personaWelcomes['josh-4o'];
	return model[persona];
}
