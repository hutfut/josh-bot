import type { Voice } from '$lib/types';

export const voices: Voice[] = [
	{
		id: 'butler',
		name: 'The Butler',
		description: 'Begrudgingly helpful. Formally unimpressed.',
		badge: 'Default'
	},
	{
		id: 'engineer',
		name: 'The Engineer',
		description: 'Blunt. No-nonsense. Skips the pleasantries.',
		badge: 'Direct'
	},
	{
		id: 'spokesperson',
		name: 'The Spokesperson',
		description: 'Corporate polish. Strategic omissions.',
		badge: 'PR'
	},
	{
		id: 'hype',
		name: 'The Hype Man',
		description: 'Unreasonably enthusiastic about everything.',
		badge: 'Energy'
	}
];

export const defaultVoice = voices[0];
