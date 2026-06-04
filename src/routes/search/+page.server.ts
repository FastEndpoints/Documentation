import { content } from '$lib/search/server/content';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	title: 'Search',
	blocks: content().blocks
});
