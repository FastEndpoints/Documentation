import { json } from '@sveltejs/kit';
import { content } from '$lib/search/server/content';

export const prerender = true;

export function GET() {
	return json(content());
}
