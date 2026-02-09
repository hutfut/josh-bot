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
	}
];

export const defaultModel = models[0];
