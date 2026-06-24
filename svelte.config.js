import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs'
		}),
		prerender: {
			entries: ['*', '/search.json', '/sitemap.xml'],
			handleMissingId: 'fail'
		}
	},
	preprocess: vitePreprocess()
};

export default config;
