import { getPage } from '$lib/content/docs';
import { renderMarkdown } from '$lib/content/markdown';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const page = getPage('benchmarks');
	return {
		title: page.title,
		description: page.description,
		page: {
			...page,
			html: await renderMarkdown(page.body)
		}
	};
};
