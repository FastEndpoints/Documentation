import Index from "flexsearch";
import type { SearchBlocks, SearchResult } from "../types";



const index = new Index<string>({ tokenize: 'forward' });
const searchLookup = new Map<string, SearchResult>();

export let isInited = false;


export async function init(origin: string) {
    if (isInited) return;

    const rsp = await fetch(`${origin}/search.json`);
    const searchData : SearchBlocks = await rsp.json();

    for (const { breadcrumbs, content, href } of searchData.blocks) {
        const title = breadcrumbs[breadcrumbs.length - 1];

        searchLookup.set(href, {
            title,
            href,
            breadcrumbs,
            content
        });

        index.add(href, `${title} ${content}`);
    }

    isInited = true;
}

export function search(query: string): SearchResult[] {
    const resultHrefs = index.search(query);

    return resultHrefs.map(lookup);
}

function lookup(href: string) {
    const result = searchLookup.get(href);

    if (result) {
        return result;
    }

    // Should never reach this state, 
    // consider disabling @typescript-eslint/no-non-null-assertion 
    // eslint rule
    throw Error("Invalid id/href");
}



