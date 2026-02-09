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
		id: 'josh-o3-mini',
		name: 'josh-o3-mini',
		description: 'Thinks before speaking. A first.',
		badge: 'Coming Soon',
		comingSoon: true
	},
	{
		id: 'josh-4o-vision',
		name: 'josh-4o-vision',
		description: 'Judges your code by looking at it.',
		badge: 'Research',
		comingSoon: true
	}
];

export const defaultModel = models[0];
