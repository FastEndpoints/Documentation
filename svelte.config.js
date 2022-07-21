// import adapter from '@sveltejs/adapter-auto';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	extensions: ['.svelte', '.md'],

// 	kit: {
// 		outDir: './docs',
// 		adapter: adapter(),

// 		prerender: {
// 			default: true,
// 			entries: ['*']
// 		}
// 	},
// 	preprocess: preprocess({})
// };

// export default config;

import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';
const repo = '/FastEndpoints-DocSite';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs'
		}),
		appDir: 'app_',
		prerender: {
			default: true,
			entries: ['*']
		}
	},
	preprocess: preprocess({})
};

export default config;
