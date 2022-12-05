export type SearchBlocks = {
    blocks: SearchNode[]
}

export type SearchNode = {
    breadcrumbs: string[];
    content?: string;
    href: string;
}

export type SearchResult = {
    title: string;
} & SearchNode;
