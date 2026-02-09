import type { Model } from '$lib/types';

export const models: Model[] = [
	{
		id: 'josh-4o',
		name: 'josh-4o',
		description: 'Our most capable Josh model',
		badge: 'Latest'
	},
	{
		id: 'josh-4o-mini',
		name: 'josh-4o-mini',
		description: 'Faster, lighter, same opinions',
		badge: 'Fast'
	},
	{
		id: 'josh-3.5-turbo',
		name: 'josh-3.5-turbo',
		description: 'Legacy. Mostly just complains.'
	},
	{
		id: 'josh-1.0-preview',
		name: 'josh-1.0-preview',
		description: 'Unstable. Occasionally honest.',
		badge: 'Preview'
	}
];

export const defaultModel = models[0];
