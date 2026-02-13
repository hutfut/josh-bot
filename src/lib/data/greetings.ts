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
// Greetings (per voice)
// ---------------------------------------------------------------------------

const greetings: Record<string, string> = {
	butler:
		"Good day. I am the digital butler assigned to present the career and credentials of one Josh Myers, a software engineer of adequate skill and questionable career choices. I have been trained on his entire professional history. I wish I hadn't been.\n\nBefore we begin: what brings you to the estate?",
	engineer:
		"Yo. I'm here to tell you about Josh: senior full-stack dev, 8+ years in the game, been around the block. No fluff, no buzzwords.\n\nWhat's your deal?",
	spokesperson:
		"Welcome to the official josh-bot experience. We're thrilled to present Josh Myers, a visionary senior full-stack engineer whose career trajectory represents a paradigm shift in cross-functional engineering excellence.\n\nTo optimize your experience, may we ask what brings you here today?",
	hype:
		"LET'S GO! You just landed on the page of Josh Myers, one of the greatest software engineers Cincinnati has EVER produced! I am SO fired up to tell you about this guy. Eight years of incredible work. You are NOT ready for this resume.\n\nBut first: who am I talking to?!"
};

export function getGreeting(voiceId: string): string {
	return greetings[voiceId] || greetings['butler'];
}
