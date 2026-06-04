import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { slugify, stripMarkdown } from './slug';
import type { DocPage, Heading, SidebarLink } from './types';

const docsDir = path.join(process.cwd(), 'src/content/docs');
const pagesDir = path.join(process.cwd(), 'src/content/pages');

function readMarkdown(filePath: string) {
	const source = fs.readFileSync(filePath, 'utf-8');
	const parsed = matter(source);
	return {
		data: parsed.data as { title?: string; description?: string; slug?: string; order?: number },
		body: parsed.content.trimStart()
	};
}

function normalizeBody(body: string, title: string) {
	return body.replaceAll('{$frontmatter.title}', title);
}

function extractHeadings(body: string): Heading[] {
	const headings: Heading[] = [];
	const seen = new Map<string, number>();

	for (const match of body.matchAll(/^(#{1,4})\s+(.+)$/gm)) {
		const level = match[1].length;
		const text = stripMarkdown(match[2]);
		if (!text) continue;

		const base = slugify(text);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		headings.push({ level, text, slug: count ? `${base}-${count}` : base });
	}

	return headings;
}

function readDocFile(file: string): DocPage {
	const match = /^(\d+)-(.+)\.md$/.exec(file);
	if (!match) throw new Error(`Invalid docs content filename: ${file}`);

	const order = Number(match[1]);
	const slug = match[2];
	const fullPath = path.join(docsDir, file);
	const { data, body: rawBody } = readMarkdown(fullPath);
	const title = data.title;
	const description = data.description;

	if (!title) throw new Error(`Missing title frontmatter: ${file}`);
	if (!description) throw new Error(`Missing description frontmatter: ${file}`);

	const body = normalizeBody(rawBody, title);
	const stat = fs.statSync(fullPath);

	return {
		title,
		description,
		slug: data.slug ?? slug,
		order: data.order ?? order,
		path: fullPath,
		body,
		headings: extractHeadings(body),
		lastUpdated: stat.mtime.toISOString()
	};
}

export function getDocs(): DocPage[] {
	return fs
		.readdirSync(docsDir)
		.filter((file) => file.endsWith('.md'))
		.map(readDocFile)
		.sort((a, b) => a.order - b.order);
}

export function getDoc(slug: string) {
	return getDocs().find((doc) => doc.slug === slug);
}

export function getSidebar(): SidebarLink[] {
	return getDocs().map((doc) => ({ title: doc.title, slug: `/docs/${doc.slug}` }));
}

export function getAllRoutes() {
	return ['/', '/docs', '/benchmarks', ...getDocs().map((doc) => `/docs/${doc.slug}`)];
}

export function getPage(name: string): DocPage {
	const fullPath = path.join(pagesDir, `${name}.md`);
	const { data, body: rawBody } = readMarkdown(fullPath);
	const title = data.title;
	const description = data.description;

	if (!title) throw new Error(`Missing title frontmatter: ${name}.md`);
	if (!description) throw new Error(`Missing description frontmatter: ${name}.md`);

	const body = normalizeBody(rawBody, title);
	const stat = fs.statSync(fullPath);

	return {
		title,
		description,
		slug: name,
		order: 0,
		path: fullPath,
		body,
		headings: extractHeadings(body),
		lastUpdated: stat.mtime.toISOString()
	};
}
