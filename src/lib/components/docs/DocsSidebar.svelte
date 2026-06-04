<script lang="ts">
	import { page } from '$app/stores';
	import type { SidebarLink } from '$lib/content/types';

	export let links: SidebarLink[] = [];

	let isOpen = false;

	$: activeLink = links.find((link) => $page.url.pathname === link.slug);
	$: if ($page.url.pathname) isOpen = false;
</script>

<aside id="main-sidebar" class:open={isOpen} class="docs-sidebar">
	<button
		type="button"
		class="docs-sidebar__toggle"
		aria-expanded={isOpen}
		aria-controls="docs-sidebar-nav"
		on:click={() => (isOpen = !isOpen)}
	>
		<span>
			<span class="docs-sidebar__label">Documentation</span>
			<span class="docs-sidebar__active">{activeLink?.title ?? 'Select a page'}</span>
		</span>
		<svg viewBox="0 0 20 20" aria-hidden="true">
			<path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
		</svg>
	</button>

	<nav id="docs-sidebar-nav" aria-label="Documentation">
		{#each links as link}
			<a href={link.slug} class:active={$page.url.pathname === link.slug} on:click={() => (isOpen = false)}>
				<span>{link.title}</span>
			</a>
		{/each}
	</nav>
</aside>
