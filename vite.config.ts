import path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Plugin, UserConfig } from 'vite';

function contentFullReload(): Plugin {
	return {
		name: 'content-full-reload',
		handleHotUpdate({ file, server }) {
			const relativeFile = path.relative(process.cwd(), file).replaceAll(path.sep, '/');

			if (/^src\/content\/.+\.md$/.test(relativeFile)) {
				server.ws.send({ type: 'full-reload', path: '*' });
			}
		}
	};
}

export default {
	plugins: [contentFullReload(), sveltekit()],
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	}
} satisfies UserConfig;
