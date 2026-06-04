<script lang="ts">
	export let className = '';
	export { className as class };
</script>

<span class={`site-chip ${className}`}><slot /></span>
