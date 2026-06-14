<script lang="ts">
	import { page } from '$app/stores';
	import { config, navbar } from '../../../config';
	import Logo from '../Logo.svelte';
	import Button from './Button.svelte';
	import Chip from './Chip.svelte';
	import SocialLink from './SocialLink.svelte';
	import SearchBox from '$lib/search/client/components/SearchBox.svelte';
	import { searchStore } from '$lib/search/client';

	function active(link: { slug: string; match?: RegExp }) {
		return link.match?.test($page.url.pathname) || $page.url.pathname === link.slug;
	}
</script>

<header class="site-navbar">
	<div class="site-navbar__inner">
		<div class="logo flex gap-4 items-center">
			<div class="max-w-[185px] min-w-[185px]">
				<Button href="/">
					<Logo />
				</Button>
			</div>
			<Chip class="text-center !h-auto hidden 420:inline-flex">Build Performant APIs Fast!</Chip>
		</div>
		<nav class="site-navbar__links" aria-label="Main navigation">
			{#each navbar.links as link}
				<a href={link.slug} class:active={active(link)} target={link.slug.startsWith('http') ? '_blank' : undefined} rel={link.slug.startsWith('http') ? 'noreferrer' : undefined}>{link.title}</a>
			{/each}
		</nav>
		<div class="site-navbar__actions">
			<SearchBox on:click={() => searchStore.toggleOpen()} />
			<SocialLink type="gitHub" href={config.github} />
			<SocialLink type="discord" href={config.discord} />
		</div>
	</div>
</header>

<style>
	@media (max-width: 1200px) {
		.site-navbar__actions :global(.social-link) {
			gap: 0;
		}

		.site-navbar__actions :global(.social-link span) {
			display: none;
		}
	}
</style>
