import type { SearchBlocks, SearchNode } from '../types';
import { getDocs } from '$lib/content/docs';
import { slugify } from '$lib/content/slug';
import { renderPlaintext } from './markdown';

function generateUrl(titleSlug: string, sectionName?: string) {
	if (sectionName) {
		return `/docs/${titleSlug}/#${slugify(sectionName)}`;
	}

	return `/docs/${titleSlug}`;
}

export function content(): SearchBlocks {
	const blocks: SearchNode[] = [];

	for (const doc of getDocs()) {
		const h2Sections = doc.body.trim().split(/^## /m);
		const introWithTitle = h2Sections.shift()?.trim();
		const intro = introWithTitle?.replace(`# ${doc.title}`, '').trim();

		blocks.push({
			breadcrumbs: [doc.title],
			href: generateUrl(doc.slug),
			content: renderPlaintext(intro)
		});

		for (const h2Section of h2Sections) {
			const h2Lines = h2Section.split('\n');
			const h2Title = h2Lines.shift()?.trim() || '';
			const h2Content = h2Lines.join('\n');
			const h3Sections = h2Content.trim().split(/^### /m);
			const h2Intro = h3Sections.shift()?.trim();

			blocks.push({
				breadcrumbs: [doc.title, h2Title],
				content: renderPlaintext(h2Intro),
				href: generateUrl(doc.slug, h2Title)
			});

			for (const h3Section of h3Sections) {
				const h3Lines = h3Section.split('\n');
				const h3Title = h3Lines.shift()?.trim() || '';
				const h3Content = h3Lines.join('\n');
				const h4Sections = h3Content.trim().split(/^#### /m);
				const h3Intro = h4Sections.shift()?.trim();

				blocks.push({
					breadcrumbs: [doc.title, h2Title, h3Title],
					content: renderPlaintext(h3Intro),
					href: generateUrl(doc.slug, h3Title)
				});

				for (const h4Section of h4Sections) {
					const h4Lines = h4Section.split('\n');
					const h4Title = h4Lines.shift()?.trim() || '';
					const h4Content = h4Lines.join('\n');

					blocks.push({
						breadcrumbs: [doc.title, h2Title, h3Title, h4Title],
						content: renderPlaintext(h4Content),
						href: generateUrl(doc.slug, h4Title)
					});
				}
			}
		}
	}

	return { blocks };
}
