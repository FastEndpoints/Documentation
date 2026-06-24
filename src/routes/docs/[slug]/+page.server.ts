import { error } from '@sveltejs/kit';
import { getDoc, getDocs, getSidebar } from '$lib/content/docs';
import { renderMarkdown } from '$lib/content/markdown';
import type { PageServerLoad } from './$types';

export const prerender = true;

export function entries() {
	return getDocs().map((doc) => ({ slug: doc.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const doc = getDoc(params.slug);
	if (!doc) throw error(404, `Unknown documentation page: ${params.slug}`);

	return {
		title: doc.title,
		description: doc.description,
		doc: {
			...doc,
			html: await renderMarkdown(doc.body)
		},
		sidebar: getSidebar()
	};
};
