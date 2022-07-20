import { sveltekit } from '@sveltejs/kit/vite';
import kitDocs from '@svelteness/kit-docs/node';
import icons from 'unplugin-icons/vite';
import { UserConfig } from 'vite';

export default {
	plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()]
} as UserConfig;
