import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Use Node.js runtime for the API endpoint (needed for Anthropic SDK)
			runtime: 'nodejs22.x'
		})
	}
};

export default config;
