<script context="module" lang="ts">
	export const prerender = true;

	export const load = createKitDocsLoader({
		sidebar: {
			// @ts-ignore
			'/': null,
			'/docs': '/docs'
		}
	});
</script>

<script lang="ts">
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import '../app.css';
	import '../vars.css';
	import { goto } from '$app/navigation';

	import { navigating, page } from '$app/stores';

	import {
		Button,
		Chip,
		createKitDocsLoader,
		createSidebarContext,
		KitDocs,
		KitDocsLayout,
		SocialLink,
		type MarkdownMeta,
		type ResolvedSidebarConfig
	} from '@svelteness/kit-docs';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { config, navbar } from '../config';
	import Logo from '../lib/components/Logo.svelte';

	import { searchStore, SearchBox, SearchModal } from '$lib/search/client';

	export let meta: MarkdownMeta | null = null;
	export let sidebar: ResolvedSidebarConfig | null = null;

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16,
		easing: 'ease',
		showSpinner: false
	});

	$: {
		// Prevent loading spinner when scrolling down
		if ($navigating?.from.pathname !== $navigating?.to.pathname) {
			NProgress.start();
		}

		if ($navigating?.to.pathname === '/') {
			NProgress.done();
		}

		if (!$navigating) {
			NProgress.done();
		}
	}

	const { activeCategory } = createSidebarContext(sidebar);

	$: category = $activeCategory ? `${$activeCategory}: ` : '';
	$: title = meta ? `${category}${meta.title} | FastEndpoints` : null;
	$: description = meta?.description;

	async function navigate(href: string) {
		searchStore.close();
		await goto(href);
	}
</script>

<svelte:head>
	{#key $page.url.pathname}
		{#if title}
			<title>{title}</title>
		{/if}
		{#if !description}
			<meta name="description" content={config.seo.description} />
		{:else}
			<meta name="description" content={description} />
		{/if}
		<meta name="keywords" content={config.seo.keywords.join(', ')} />
		<!-- OG -->
		<meta property="og:url" content={`${config.siteUrl}${$page.url.pathname}`} />
		<meta property="og:image" content={`${config.siteUrl}${config.openGraph.image}`} />
		<meta property="og:type" content={config.openGraph.type} />
		<meta property="og:site_name" content={config.openGraph.siteName} />
		<meta property="og:description" content={config.openGraph.description} />
		<meta property="og:title" content={config.openGraph.title} />
		<meta property="og:locale" content={config.openGraph.locale} />
		<!-- Robots -->
		<!-- <meta name="robots" content="index,follow" /> -->
		<!-- <meta name="googlebot" content="index,follow" /> -->
	{/key}
</svelte:head>

<KitDocs {meta}>
	<KitDocsLayout {navbar} {sidebar} search>
		<SearchBox on:click={() => searchStore.toggleOpen() } slot="search"/>
		<div class="logo flex gap-4 items-center" slot="navbar-left">
			<div class="max-w-[185px] min-w-[185px]">
				<Button href="/">
					<Logo />
				</Button>
			</div>
			<Chip class="text-center !h-auto hidden 420:inline-flex">Build Performant APIs Fast!</Chip>
		</div>

		<div class="socials flex flex-row" slot="navbar-right-alt">
			<SocialLink type="gitHub" href={config.github} />
			<SocialLink type="discord" href={config.discord} />
		</div>

		<slot />

		<footer slot="main-bottom">
			<div class="border-b-2 border-feDarkBlue-600 mb-6 h-1 w-full" />
			<div class="flex justify-between items-center">
				<div class="prose text-sm">© FastEndpoints {new Date().getFullYear()}</div>
				<Button href="/" class="max-w-[145px]">
					<Logo />
				</Button>
			</div>
		</footer>
	</KitDocsLayout>
		<SearchModal 
			isOpen={$searchStore.isOpen} 
			query={$searchStore.query}  
			results={$searchStore.results} 
			on:openchange={({ detail: { newIsOpen } }) => {
				if (newIsOpen) {
					searchStore.open();
				}
				else {
					searchStore.close();
				}
			}} 
			on:querychange={({ detail: { newQuery }}) => searchStore.search(newQuery)} 
			on:select={({ detail: { href } }) => navigate(href)}
			/>
</KitDocs>

<style>
	:global(:root) {
		--kd-color-brand-rgb: 0, 223, 255;
	}

	:global(:root.dark) {
		--kd-color-brand-rgb: 0, 223, 255;
	}

	/* .logo img :global {
		width: 185px;
	} */

	.logo :global(a) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo :global(svg) {
		height: 36px;
		overflow: hidden;
	}
</style>
