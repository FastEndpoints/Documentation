import { marked, Renderer } from 'marked';
import { codeToHtml } from 'shiki';
import { slugify } from './slug';

export type CodeFenceMeta = {
	lang: string;
	title?: string;
	copy: boolean;
};

const theme = 'one-dark-pro';

function escapeHtml(input: string) {
	return input
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function stripTags(input: string) {
	return input.replace(/<[^>]+>/g, '');
}

function escapeTextareaValue(input: string) {
	return escapeHtml(input).replace(/\r\n?|\n/g, '&#10;');
}

function removePreBackgroundColor(html: string) {
	return html.replace(
		/(<pre\b[^>]*\sstyle=")([^"]*)(")/gi,
		(_match, start: string, style: string, end: string) => {
			const cleanedStyle = style
				.replace(/(?:^|\s*)background-color\s*:\s*#[0-9a-f]{3,8}\s*;?/gi, '')
				.trim();

			return `${start}${cleanedStyle}${end}`;
		}
	);
}

function mapLang(lang: string) {
	const normalized = lang.toLowerCase();
	if (normalized === 'cs') return 'csharp';
	if (normalized === 'sh' || normalized === 'shell') return 'bash';
	if (normalized === 'cmd') return 'bat';
	if (normalized === 'ps') return 'powershell';
	return normalized || 'text';
}

export function parseCodeFenceMeta(info = ''): CodeFenceMeta {
	let value = info.trim();
	let lang = '';
	const first = /^([^\s|+]+)/.exec(value);
	if (first) {
		lang = first[1];
		value = value.slice(first[0].length).trim();
	}

	let copy = false;
	let title: string | undefined;
	const tokens = value
		.replace(/\s*\+\s*/g, '|')
		.split('|')
		.flatMap((part) => part.trim().split(/\s+(?=copy$|title=)/i))
		.map((part) => part.trim())
		.filter(Boolean);

	for (const token of tokens) {
		if (/^copy$/i.test(token)) {
			copy = true;
			continue;
		}

		const titleMatch = /^title=(.+)$/i.exec(token);
		if (titleMatch) {
			title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
		}
	}

	return { lang: mapLang(lang), title, copy };
}

async function renderCode(code: string, info: string) {
	const meta = parseCodeFenceMeta(info);
	let highlighted: string;

	try {
		highlighted = removePreBackgroundColor(await codeToHtml(code, { lang: meta.lang, theme }));
	} catch {
		highlighted = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
	}

	return `<div class="code-fence lang-${escapeHtml(meta.lang)}" data-copy="${meta.copy ? 'true' : 'false'}">${
		meta.title || meta.copy
			? `<div class="code-fence__bar">${meta.title ? `<span class="code-fence__title">${escapeHtml(meta.title)}</span>` : '<span></span>'}${
					meta.copy ? '<button type="button" class="code-fence__copy">Copy</button>' : ''
				}</div>`
			: ''
	}<div class="code-fence__code">${highlighted}</div><textarea class="code-fence__raw" hidden>${escapeTextareaValue(code)}</textarea></div>`;
}

async function replaceCodeFences(markdown: string) {
	let output = '';
	let lastIndex = 0;
	const fenceRegex = /```([^\r\n]*)\r?\n([\s\S]*?)\r?\n```/g;

	for (const match of markdown.matchAll(fenceRegex)) {
		const index = match.index ?? 0;
		output += markdown.slice(lastIndex, index);
		output += await renderCode(match[2], match[1]);
		lastIndex = index + match[0].length;
	}

	return output + markdown.slice(lastIndex);
}

function replaceAdmonitions(markdown: string) {
	return markdown.replace(
		/^\s*::: ?admonition\s+type=(?:"([^"]+)"|'([^']+)'|([^\s:]+))\s*(?:::{1})?\r?\n([\s\S]*?)\r?\n\s*:::/gm,
		(_match, quoted: string, singleQuoted: string, bare: string, body: string) => {
			const type = (quoted || singleQuoted || bare || 'note').toLowerCase();
			const html = marked.parse(body, {
				mangle: false,
				headerIds: false,
				renderer: new Renderer()
			}) as string;
			return `<aside class="admonition admonition-${escapeHtml(type)}"><p class="admonition__title">${escapeHtml(type)}</p>${html}</aside>`;
		}
	);
}

function createRenderer() {
	const renderer = new Renderer();
	const seen = new Map<string, number>();

	renderer.heading = (text: string, level: number) => {
		const plain = stripTags(text);
		const base = slugify(plain);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		const id = count ? `${base}-${count}` : base;
		return `<h${level} id="${id}"><a class="header-anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${level}>`;
	};

	renderer.table = (header: string, body: string) =>
		`<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;

	return renderer;
}

export async function renderMarkdown(markdown: string) {
	const normalized = markdown.replaceAll('https://hostname:port/', '`https://hostname:port/`');
	const withCode = await replaceCodeFences(normalized);
	const withAdmonitions = replaceAdmonitions(withCode);
	return marked(withAdmonitions, {
		mangle: false,
		headerIds: false,
		renderer: createRenderer()
	}) as string;
}
