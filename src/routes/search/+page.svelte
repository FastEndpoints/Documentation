<script lang="ts">
	import type { SearchNode } from '$lib/search/types';

	export let data: { blocks: SearchNode[] };
</script>

<main class="site-main">
	<pre>{JSON.stringify(data.blocks, null, 2)}</pre>
</main>
