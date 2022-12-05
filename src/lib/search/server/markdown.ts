import fs from 'fs';
import { marked, Renderer as MarkedRenderer } from 'marked';

// e.g. 
// :::admonition type="note"
// <Text>
// :::
// 
// The regex groups the <Text> part under $2 and is used to 
// extract it from the notation
const nonStandardMdSyntaxRegex = /([:]{3}.*\n)([\s\S]+?)([:]{3})/g;

type Metadata = {
    title: string;
    description?: string;
}

function extractMetadata(frontmatter: string) : Metadata {
    const metadata : Metadata = {
        title: ''
    };

    for (const row of frontmatter.split('\n')) {
        const separatorIx = row.indexOf(':');
        const name = row.slice(0, separatorIx).trim();
        const value = row.slice(separatorIx + 1).trim();
        if (name === 'title' || name === 'description') {
            metadata[name] = value;
        }
    }

    return metadata;
}

export function readBodyAndTitle(filePath: string) {
    const text = fs.readFileSync(filePath, 'utf-8');

    const frontmatterMatch = /---\r?\n([\s\S]+?)\r?\n---/.exec(text);

    if (!frontmatterMatch) {
        throw new Error('Missing markdown frontmatter')
    }

    const frontmatter = frontmatterMatch[1];

    let body = text.slice(frontmatterMatch[0].length);

    const { title } = extractMetadata(frontmatter);
    if (!title) {
        throw new Error(`Title is missing from the file frontmatter (${filePath})`);
    }

    body = body
        .replace('{$frontmatter.title}', title)
        .replace(nonStandardMdSyntaxRegex, "$2");

    return {
        title,
        body
    }
}

const block = (text: string) => `${text}\n`;
const inline = (text: string) => text;

// the @types/marked show 'options' as a required property of the
// renderer, but it's not - below approach is easier than writing
// another d.ts definition
type Renderer = Omit<MarkedRenderer, 'options'>;

const plaintextRenderer : Renderer = {
    heading: (text: string) => `${text}\n\n`,
    code: block,
    blockquote: block,
    html: () => '',
    hr: () => '',
    list: block,
    listitem: block,
    checkbox: () => '',
    paragraph: (text) => `${text}\n\n`,
    table: block,
    tablerow: block,
    tablecell: (text, _opts) => {
        return text + ' ';
    },
    strong: inline,
    em: inline,
    codespan: inline,
    br: () => '',
    del: inline,
    link: (_href, _title, text) => text,
    image: (_href, _title, text) => text,
    text: inline,
}


export function renderPlaintext(markdown?: string) {
    if (!markdown) {
        return;
    }

    marked.use({
        renderer: plaintextRenderer
    })

    return marked(markdown).trim();
}