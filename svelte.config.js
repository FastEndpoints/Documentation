import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs'
		}),
		prerender: {
			default: true,
			entries: ['*']
		}
	},
	preprocess: preprocess({
		postcss: true
	})
};

export default config;
