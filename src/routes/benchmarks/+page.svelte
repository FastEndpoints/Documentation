<script lang="ts">
	import type { RenderedPage } from '$lib/content/types';

	export let data: { page: RenderedPage };
</script>

<main class="site-main benchmarks-page">
	<article class="prose docs-article">
		{@html data.page.html}
	</article>
</main>
