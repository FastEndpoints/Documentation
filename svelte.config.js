import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	kit: {
		outDir: './docs',
		adapter: adapter(),

		prerender: {
			default: true,
			entries: ['*']
		}
	},
	preprocess: preprocess({})
};

export default config;
