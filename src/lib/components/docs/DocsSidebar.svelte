<script lang="ts">
	import { page } from '$app/stores';
	import type { SidebarSection } from '$lib/content/types';

	export let groups: SidebarSection[] = [];

	let isOpen = false;

	$: links = groups.flatMap((group) => group.links);
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
		{#each groups as group (group.id)}
			<div class="docs-sidebar__group">
				<p class="docs-sidebar__heading">
					<span class="docs-sidebar__heading-icon" aria-hidden="true">
						{#if group.id === 'getting-started'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path d="M3.75 13.5 14.25 2.25 12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
							</svg>
						{:else if group.id === 'rest-apis'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<circle cx="12" cy="12" r="10" />
								<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
								<path d="M2 12h20" />
							</svg>
						{:else if group.id === 'messaging'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
								/>
							</svg>
						{:else if group.id === 'tooling'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
								/>
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
								/>
							</svg>
						{/if}
					</span>
					{group.title}
				</p>
				{#each group.links as link}
					<a
						href={link.slug}
						class:active={$page.url.pathname === link.slug}
						on:click={() => (isOpen = false)}
					>
						<span>{link.title}</span>
					</a>
				{/each}
			</div>
		{/each}
	</nav>
</aside>
