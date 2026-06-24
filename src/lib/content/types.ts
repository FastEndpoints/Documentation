export type Heading = {
	level: number;
	text: string;
	slug: string;
};

export type DocPage = {
	title: string;
	description: string;
	slug: string;
	order: number;
	path: string;
	body: string;
	headings: Heading[];
	lastUpdated: string;
};

export type SidebarLink = {
	title: string;
	slug: string;
};

export type RenderedPage = DocPage & {
	html: string;
};
