<script lang="ts">
	export let href = '';
	export let className = '';
	export { className as class };
</script>

{#if href}
	<a {href} class={`site-button ${className}`}><slot /></a>
{:else}
	<button type="button" class={`site-button ${className}`}><slot /></button>
{/if}
