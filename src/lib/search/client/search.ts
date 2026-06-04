import FlexSearchIndex from 'flexsearch/dist/module/index.js';
import type { SearchBlocks, SearchResult } from '../types';

type SearchIndex = {
	add(id: string, text: string): void;
	search(query: string): string[];
};

const index = new (FlexSearchIndex as unknown as {
	new (options: Record<string, unknown>): SearchIndex;
})({
	tokenize: 'forward'
});
const searchLookup = new Map<string, SearchResult>();

export let isInited = false;

export async function init(origin: string) {
	if (isInited) return;

	const rsp = await fetch(`${origin}/search.json`);
	const searchData: SearchBlocks = await rsp.json();

	for (const { breadcrumbs, content, href } of searchData.blocks) {
		const title = breadcrumbs[breadcrumbs.length - 1];

		searchLookup.set(href, {
			title,
			href,
			breadcrumbs,
			content
		});

		index.add(href, `${title} ${content ?? ''}`);
	}

	isInited = true;
}

export function search(query: string): SearchResult[] {
	const resultHrefs = index.search(query);
	return resultHrefs.map(lookup);
}

function lookup(href: string) {
	const result = searchLookup.get(href);
	if (result) return result;
	throw Error('Invalid id/href');
}
