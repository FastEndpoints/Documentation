<script lang="ts">
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import '../../styles/fonts.css';
	import '../../../app.css';
	import '../../../vars.css';
	import { config } from '../../../config';
	import Logo from '../Logo.svelte';
	import Button from './Button.svelte';
	import Navbar from './Navbar.svelte';
	import { searchStore, SearchModal } from '$lib/search/client';

	export let title: string | null = null;
	export let description: string | null = null;

	NProgress.configure({ minimum: 0.16, easing: 'ease', showSpinner: false });

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) NProgress.start();
	});

	afterNavigate(() => NProgress.done());

	async function navigate(href: string) {
		searchStore.close();
		await goto(href);
	}

	$: pageTitle = title ? `${title} | FastEndpoints` : config.seo.title;
	$: metaDescription = description || config.seo.description;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={config.seo.keywords.join(', ')} />
	<meta property="og:url" content={`${config.siteUrl}${$page.url.pathname}`} />
	<meta property="og:image" content={`${config.siteUrl}${config.openGraph.image}`} />
	<meta property="og:type" content={config.openGraph.type} />
	<meta property="og:site_name" content={config.openGraph.siteName} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:locale" content={config.openGraph.locale} />
</svelte:head>

<div class="kit-docs site-shell">
	<Navbar />
	<slot />
	<footer class="site-footer">
		<div class="border-b-2 border-feDarkBlue-600 mb-6 h-1 w-full"></div>
		<div class="flex justify-between items-center">
			<div class="prose text-sm">© FastEndpoints {new Date().getFullYear()}</div>
			<Button href="/" class="max-w-[145px]"><Logo /></Button>
		</div>
	</footer>
	<SearchModal
		isOpen={$searchStore.isOpen}
		query={$searchStore.query}
		results={$searchStore.results}
		on:openchange={({ detail: { newIsOpen } }) => (newIsOpen ? searchStore.open() : searchStore.close())}
		on:querychange={({ detail: { newQuery } }) => searchStore.search(newQuery)}
		on:select={({ detail: { href } }) => navigate(href)}
	/>
</div>

<svelte:window
	on:keydown={(event) => {
		const isSearchCombo = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
		if (isSearchCombo) {
			event.preventDefault();
			searchStore.toggleOpen();
		}
		if (event.key === 'Escape') searchStore.close();
	}}
	on:click={(event) => {
		const target = event.target as HTMLElement;
		const button = target.closest('.code-fence__copy') as HTMLButtonElement | null;
		if (!button) return;
		const fence = button.closest('.code-fence');
		const raw = fence?.querySelector('.code-fence__raw') as HTMLTextAreaElement | null;
		if (!raw) return;
		navigator.clipboard?.writeText(raw.value);
		button.textContent = 'Copied';
		setTimeout(() => (button.textContent = 'Copy'), 1500);
	}}
/>
