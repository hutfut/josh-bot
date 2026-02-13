import type { Voice } from '$lib/types';

export const voices: Voice[] = [
	{
		id: 'butler',
		name: 'The Butler',
		description: 'Begrudgingly helpful. Formally unimpressed.',
		badge: 'Default',
		preview: "I have been trained on his entire professional history. I wish I hadn't been."
	},
	{
		id: 'engineer',
		name: 'The Engineer',
		description: 'Blunt. No-nonsense. Skips the pleasantries.',
		badge: 'Direct',
		preview: 'No fluff, no buzzwords.'
	},
	{
		id: 'spokesperson',
		name: 'The Spokesperson',
		description: 'Corporate polish. Strategic omissions.',
		badge: 'PR',
		preview: 'A paradigm shift in cross-functional engineering excellence.'
	},
	{
		id: 'hype',
		name: 'The Hype Man',
		description: 'Unreasonably enthusiastic about everything.',
		badge: 'Energy',
		preview: 'You are NOT ready for this resume.'
	}
];

export const defaultVoice = voices[0];
