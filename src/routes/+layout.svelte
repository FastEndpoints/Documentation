<script lang="ts">
	import { page } from '$app/stores';
	import SiteShell from '$lib/components/site/SiteShell.svelte';
</script>

<SiteShell title={$page.data.title ?? null} description={$page.data.description ?? null}>
	<slot />
</SiteShell>
