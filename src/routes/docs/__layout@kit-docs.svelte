<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<slot />
