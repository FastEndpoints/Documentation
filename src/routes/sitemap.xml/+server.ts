import { config } from '../../config';
import { getAllRoutes } from '$lib/content/docs';

export const prerender = true;

export function GET() {
	const urls = getAllRoutes()
		.map((route) => `\t<url><loc>${config.siteUrl}${route}</loc></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8'
			}
		}
	);
}
