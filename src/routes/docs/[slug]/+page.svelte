<script lang="ts">
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
	import OnThisPage from '$lib/components/docs/OnThisPage.svelte';
	import type { RenderedPage, SidebarLink } from '$lib/content/types';

	export let data: { doc: RenderedPage; sidebar: SidebarLink[] };
</script>

<div class="docs-layout">
	<DocsSidebar links={data.sidebar} />
	<main class="docs-main">
		<article class="prose docs-article">
			{@html data.doc.html}
		</article>
		<OnThisPage headings={data.doc.headings} placement="mobile" />
	</main>
	<OnThisPage headings={data.doc.headings} />
</div>
