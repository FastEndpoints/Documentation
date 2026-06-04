export function slugify(input: string) {
	return input
		.toLowerCase()
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '')
		.replace(/&[^;]+;/g, '')
		.replace(/[^a-z0-9-$]/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-|-$/g, '')
		.replace(/^([0-9])/, '_$1');
}

export function stripMarkdown(input: string) {
	return input
		.replace(/`([^`]+)`/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_~#]/g, '')
		.replace(/<[^>]+>/g, '')
		.trim();
}
