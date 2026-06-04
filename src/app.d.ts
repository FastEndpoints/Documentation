/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces.
declare module 'flexsearch/dist/module/index.js' {
	const Index: unknown;
	export default Index;
}

declare module 'highlight.js/lib/languages/csharp' {
	import type { LanguageFn } from 'highlight.js';

	const language: LanguageFn;
	export default language;
}

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface PageState {}
	// interface Platform {}
}
