<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { config, navbar } from '../../../config';
	import Logo from '../Logo.svelte';
	import Button from './Button.svelte';
	import Chip from './Chip.svelte';
	import SocialLink from './SocialLink.svelte';
	import SearchBox from '$lib/search/client/components/SearchBox.svelte';
	import { searchStore } from '$lib/search/client';

	let navbarInner: HTMLDivElement;
	let compactSocialLinks = false;

	function active(link: { slug: string; match?: RegExp }) {
		return link.match?.test($page.url.pathname) || $page.url.pathname === link.slug;
	}

	async function updateCompactSocialLinks() {
		await tick();
		if (!navbarInner) return;

		const overflowBuffer = 1;

		if (compactSocialLinks) {
			compactSocialLinks = false;
			await tick();
		}

		compactSocialLinks = navbarInner.scrollWidth > navbarInner.clientWidth + overflowBuffer;
	}

	onMount(() => {
		let frame = 0;
		const scheduleUpdate = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => void updateCompactSocialLinks());
		};

		scheduleUpdate();
		const resizeObserver = new ResizeObserver(scheduleUpdate);
		resizeObserver.observe(navbarInner);
		window.addEventListener('resize', scheduleUpdate);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			window.removeEventListener('resize', scheduleUpdate);
		};
	});
</script>

<header class="site-navbar" class:site-navbar--compact-social={compactSocialLinks}>
	<div class="site-navbar__inner" bind:this={navbarInner}>
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
	.site-navbar--compact-social .site-navbar__actions :global(.social-link) {
		gap: 0;
	}

	.site-navbar--compact-social .site-navbar__actions :global(.social-link span) {
		display: none;
	}

	@media (max-width: 768px) {
		.site-navbar__actions :global(.social-link) {
			gap: 0;
		}

		.site-navbar__actions :global(.social-link span) {
			display: none;
		}
	}
</style>
