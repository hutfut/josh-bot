import type { Persona } from '$lib/types';

// ---------------------------------------------------------------------------
// Core type
// ---------------------------------------------------------------------------

export interface FollowUp {
	prompt: string;
	category: string;
}

// ---------------------------------------------------------------------------
// Persona-specific initial follow-ups (first pills after persona selection)
// ---------------------------------------------------------------------------

export const personaInitialFollowUps: Record<Persona, FollowUp[]> = {
	recruiter: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Is he available for hire?', category: 'hiring' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	engineer: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: "What's his dev process?", category: 'devProcess' }
	],
	curious: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	]
};

// ---------------------------------------------------------------------------
// Follow-up prompts — per-persona, per-category
// ---------------------------------------------------------------------------
// Each persona has its own follow-up ordering. Index 0 is always the
// "golden path" next step for that persona.
//
// Golden paths:
// Recruiter: identity → experience → currentRole → vndly → skills → whyHire → careerGoals → contact
// Engineer:  skills → architecture → hotTakes → devProcess → aiTools → currentRole → experience → earlyCareer
// Curious:   personality → somethingWeird → gaming → cat → education → hotTakes → identity → skills
// ---------------------------------------------------------------------------

const recruiterFollowUps: Record<string, FollowUp[]> = {
	identity: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Is he looking for work?', category: 'hiring' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' }
	],
	experience: [
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	currentRole: [
		{ prompt: 'What about his time at VNDLY?', category: 'vndly' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What about his early career?', category: 'earlyCareer' },
		{ prompt: 'Is he available for hire?', category: 'hiring' }
	],
	vndly: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What about early career at Kroger?', category: 'earlyCareer' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	earlyCareer: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: 'How did he get into tech?', category: 'education' }
	],
	skills: [
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' }
	],
	competence: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: "What's his weakness?", category: 'weaknesses' }
	],
	hiring: [
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'Tell me about his experience', category: 'experience' }
	],
	contact: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'Is he looking for work?', category: 'hiring' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	whyHire: [
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: "What's his weakness?", category: 'weaknesses' }
	],
	careerGoals: [
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'Is he available for hire?', category: 'hiring' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	weaknesses: [
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'How do I contact him?', category: 'contact' }
	],
	// Fun categories — loop back to resume content
	gaming: [
		{ prompt: 'Is he any good at his actual job?', category: 'competence' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	cat: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'Is he any good?', category: 'competence' }
	],
	personality: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	hotTakes: [
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	somethingWeird: [
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What are his skills?', category: 'skills' }
	],
	education: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's his deal?", category: 'personality' }
	],
	devProcess: [
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's his weakness?", category: 'weaknesses' },
		{ prompt: 'Is he any good?', category: 'competence' }
	],
	architecture: [
		{ prompt: 'Tell me about leadership', category: 'leadership' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	leadership: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Is he available for hire?', category: 'hiring' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: 'Tell me about system design', category: 'architecture' }
	],
	aiTools: [
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: "What's his dev process?", category: 'devProcess' }
	],
	site: [
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	meta: [
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	location: [
		{ prompt: 'Is he available for work?', category: 'hiring' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	salary: [
		{ prompt: 'Is he available for work?', category: 'hiring' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	typescript: [
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'What about Python?', category: 'python' }
	],
	java: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'Tell me about early career', category: 'earlyCareer' }
	],
	python: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' }
	],
	cloud: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' }
	],
	thanks: [
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	jailbreak: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	greetings: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'Is he available for hire?', category: 'hiring' }
	],
	music: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Is he any good?', category: 'competence' }
	],
	gameDesign: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Does he play games too?', category: 'gaming' },
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: "What's his deal?", category: 'personality' }
	]
};

const engineerFollowUps: Record<string, FollowUp[]> = {
	skills: [
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'What about TypeScript?', category: 'typescript' }
	],
	architecture: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me about leadership', category: 'leadership' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'Tell me about early career', category: 'earlyCareer' }
	],
	hotTakes: [
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	devProcess: [
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: "What's his weakness?", category: 'weaknesses' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	aiTools: [
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'What are his skills?', category: 'skills' }
	],
	currentRole: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What about his time at VNDLY?', category: 'vndly' },
		{ prompt: 'Tell me about system design', category: 'architecture' }
	],
	experience: [
		{ prompt: 'What about early career at Kroger?', category: 'earlyCareer' },
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: 'What are his skills?', category: 'skills' }
	],
	earlyCareer: [
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What about his time at VNDLY?', category: 'vndly' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'What does he do outside work?', category: 'gaming' }
	],
	vndly: [
		{ prompt: 'What about early career at Kroger?', category: 'earlyCareer' },
		{ prompt: 'What about Python?', category: 'python' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	// Shared categories — engineer-flavored ordering
	identity: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	competence: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: "What's his weakness?", category: 'weaknesses' }
	],
	hiring: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'Tell me about his experience', category: 'experience' }
	],
	contact: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	gaming: [
		{ prompt: 'Does he build games too?', category: 'gameDesign' },
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	cat: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'What are his skills?', category: 'skills' }
	],
	personality: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'What does he do outside work?', category: 'gaming' }
	],
	somethingWeird: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'How was this site built?', category: 'site' }
	],
	education: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about early career', category: 'earlyCareer' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	whyHire: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: "What's his weakness?", category: 'weaknesses' },
		{ prompt: 'Tell me about his experience', category: 'experience' }
	],
	weaknesses: [
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: 'Why should we hire him?', category: 'whyHire' },
		{ prompt: 'Is he any good?', category: 'competence' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	careerGoals: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Is he available for hire?', category: 'hiring' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	leadership: [
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: "What's his dev process?", category: 'devProcess' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'Is he available for hire?', category: 'hiring' }
	],
	site: [
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he build games too?', category: 'gameDesign' }
	],
	meta: [
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	location: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'Is he available for work?', category: 'hiring' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'What does he do outside work?', category: 'gaming' }
	],
	salary: [
		{ prompt: 'Is he available for work?', category: 'hiring' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' }
	],
	typescript: [
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'What about Python?', category: 'python' }
	],
	java: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' },
		{ prompt: 'Tell me about early career', category: 'earlyCareer' }
	],
	python: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' }
	],
	cloud: [
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'Tell me about his experience', category: 'experience' }
	],
	thanks: [
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	jailbreak: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	greetings: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' }
	],
	music: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What are his skills?', category: 'skills' }
	],
	gameDesign: [
		{ prompt: 'Does he play games too?', category: 'gaming' },
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: "What's his deal?", category: 'personality' }
	]
};

const curiousFollowUps: Record<string, FollowUp[]> = {
	personality: [
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	somethingWeird: [
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	gaming: [
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'Does he build games too?', category: 'gameDesign' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	cat: [
		{ prompt: 'How did he get into tech?', category: 'education' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	education: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'What does Josh do?', category: 'identity' }
	],
	hotTakes: [
		{ prompt: 'What does Josh do?', category: 'identity' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	identity: [
		{ prompt: 'What are his skills?', category: 'skills' },
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	skills: [
		{ prompt: 'Tell me about his experience', category: 'experience' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	// Shared categories — curious-flavored ordering (fun stuff first)
	experience: [
		{ prompt: "What's he doing at Kroger now?", category: 'currentRole' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	currentRole: [
		{ prompt: 'What about his time at VNDLY?', category: 'vndly' },
		{ prompt: 'What about his early career?', category: 'earlyCareer' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	vndly: [
		{ prompt: 'What about early career at Kroger?', category: 'earlyCareer' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What about Python?', category: 'python' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	earlyCareer: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me about system design', category: 'architecture' }
	],
	competence: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: "What's his weakness?", category: 'weaknesses' }
	],
	hiring: [
		{ prompt: 'How do I contact him?', category: 'contact' },
		{ prompt: "What's he looking for next?", category: 'careerGoals' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	contact: [
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	whyHire: [
		{ prompt: "What's his weakness?", category: 'weaknesses' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	weaknesses: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Is he any good?', category: 'competence' }
	],
	careerGoals: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'How do I contact him?', category: 'contact' }
	],
	devProcess: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: "What's his weakness?", category: 'weaknesses' }
	],
	architecture: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me about leadership', category: 'leadership' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What about cloud/infra?', category: 'cloud' }
	],
	leadership: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me about system design', category: 'architecture' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	aiTools: [
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he build games too?', category: 'gameDesign' }
	],
	site: [
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	meta: [
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' }
	],
	location: [
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What does he listen to?', category: 'music' }
	],
	salary: [
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Is he available for work?', category: 'hiring' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	typescript: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'What about Python?', category: 'python' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	java: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Tell me about early career', category: 'earlyCareer' },
		{ prompt: 'What about Python?', category: 'python' }
	],
	python: [
		{ prompt: 'What about frontend work?', category: 'typescript' },
		{ prompt: 'Does he do backend too?', category: 'java' },
		{ prompt: 'Tell me about VNDLY', category: 'vndly' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	cloud: [
		{ prompt: 'What are his hot takes?', category: 'hotTakes' },
		{ prompt: 'Does he use AI tools?', category: 'aiTools' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Tell me about system design', category: 'architecture' }
	],
	thanks: [
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'How do I contact him?', category: 'contact' }
	],
	jailbreak: [
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	greetings: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'What are his hot takes?', category: 'hotTakes' }
	],
	music: [
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'What does he do outside work?', category: 'gaming' },
		{ prompt: 'Does he have any pets?', category: 'cat' },
		{ prompt: 'Tell me something weird', category: 'somethingWeird' }
	],
	gameDesign: [
		{ prompt: 'Does he play games too?', category: 'gaming' },
		{ prompt: "What's his deal?", category: 'personality' },
		{ prompt: 'How was this site built?', category: 'site' },
		{ prompt: 'What does he listen to?', category: 'music' }
	]
};

export const personaFollowUpPrompts: Record<Persona, Record<string, FollowUp[]>> = {
	recruiter: recruiterFollowUps,
	engineer: engineerFollowUps,
	curious: curiousFollowUps
};

// ---------------------------------------------------------------------------
// Default follow-ups (used when no persona is active, e.g. LLM responses)
// ---------------------------------------------------------------------------

export const defaultFollowUps: FollowUp[] = [
	{ prompt: 'What are his skills?', category: 'skills' },
	{ prompt: 'Tell me about his experience', category: 'experience' },
	{ prompt: 'Is he available for work?', category: 'hiring' },
	{ prompt: 'What are his hot takes?', category: 'hotTakes' },
	{ prompt: 'Does he have any pets?', category: 'cat' }
];

// ---------------------------------------------------------------------------
// Action pills — special follow-ups that link out instead of showing responses
// ---------------------------------------------------------------------------
// Maps persona → set of categories after which an action pill should appear.
// These are "sprinkled" into the flow at natural decision points.

/** Categories after which an "Email Josh directly" pill appears */
export const emailPillAfter: Record<Persona, Set<string>> = {
	recruiter: new Set(['hiring', 'whyHire', 'careerGoals', 'salary', 'competence']),
	engineer: new Set(['careerGoals', 'competence', 'hiring']),
	curious: new Set(['competence', 'hiring'])
};

/** Categories after which a "Skip to his resume" pill appears */
export const aboutPillAfter: Record<Persona, Set<string>> = {
	recruiter: new Set(['experience', 'skills', 'identity']),
	engineer: new Set(['identity', 'skills']),
	curious: new Set(['identity'])
};
