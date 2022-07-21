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
	import '@svelteness/kit-docs/client/styles/normalize.css';
	import '@svelteness/kit-docs/client/styles/theme.css';
	import '@svelteness/kit-docs/client/styles/vars.css';

	import { page } from '$app/stores';

	import { navigating } from '$app/stores';
	import {
		Button,
		createKitDocsLoader,
		createSidebarContext,
		KitDocs,
		KitDocsLayout,
		SocialLink,
		type MarkdownMeta,
		type NavbarConfig,
		type ResolvedSidebarConfig
	} from '@svelteness/kit-docs';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { config } from '../config';

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
		if (!$navigating) {
			NProgress.done();
		}
	}

	const navbar: NavbarConfig = {
		links: [
			{ title: 'Documentation', slug: '/docs', match: /\/docs/ },
			{ title: 'Benchmarks', slug: '/benchmarks', match: /\/benchmarks/ },
			{
				title: 'Tutorial',
				slug: 'https://dev.to/djnitehawk/building-rest-apis-in-net-6-the-easy-way-3h0d'
			},
			// TODO: API Reference
			{
				title: 'API Reference',
				slug: 'https://dev.to/djnitehawk/building-rest-apis-in-net-6-the-easy-way-3h0d'
			},
			{ title: 'Donate', slug: 'https://www.paypal.com/donate/?hosted_button_id=AU3SCQX9FXYCS' }
		]
	};

	const { activeCategory } = createSidebarContext(sidebar);

	$: category = $activeCategory ? `${$activeCategory}: ` : '';
	$: title = meta ? `${category}${meta.title} | FastEndpoints` : null;
	$: description = meta?.description;
</script>

<svelte:head>
	{#key $page.url.pathname}
		{#if title}
			<title>{title}</title>
		{/if}
		{#if description}
			<meta name="description" content={description} />
		{/if}
	{/key}
</svelte:head>

<KitDocs {meta}>
	<KitDocsLayout {navbar} {sidebar}>
		<div class="logo" slot="navbar-left">
			<Button href="/">
				<img src={'/icon.png'} alt="FastEndpoints logo" />
			</Button>
		</div>

		<div class="socials flex flex-row" slot="navbar-right-alt">
			<SocialLink type="gitHub" href={config.github} />
			<SocialLink type="discord" href={config.discord} />
		</div>

		<slot />

		<div slot="main-bottom" class="footer">
			<!-- {@html poweredByVercel} -->
		</div>
	</KitDocsLayout>
</KitDocs>

<style>
	:global(:root) {
		--kd-color-brand-rgb: 6, 182, 212;
	}

	:global(:root.dark) {
		--kd-color-brand-rgb: 6, 182, 212;
	}

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
