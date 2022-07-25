<script lang="ts">
	import { page } from '$app/stores';
	import { Button, KitDocsLayout, SocialLink } from '@svelteness/kit-docs';
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import '@svelteness/kit-docs/client/styles/vars.css';
	import { onMount } from 'svelte';
	import '../app.css';
	import { config, navbar } from '../config';
	import '../vars.css';

	onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<svelte:head>
	<title>{config.seo.title}</title>
	<meta name="description" content={config.seo.description} />
	<meta name="keywords" content={config.seo.keywords.join(', ')} />
	<!-- OG -->
	<meta property="og:url" content={`${config.siteUrl}${$page.url.pathname}`} />
	<meta property="og:type" content={config.openGraph.type} />
	<meta property="og:site_name" content={config.openGraph.siteName} />
	<meta property="og:description" content={config.openGraph.description} />
	<meta property="og:title" content={config.openGraph.title} />
	<meta property="og:locale" content={config.openGraph.locale} />
	<!-- Robots -->
	<!-- <meta name="robots" content="index,follow" /> -->
	<!-- <meta name="googlebot" content="index,follow" /> -->
</svelte:head>

<KitDocsLayout isSidebarOpen={false} {navbar} sidebar={null}>
	<div class="logo" slot="navbar-left">
		<Button href="/">
			<img src={'/icon.png'} alt="Logo" />
		</Button>
	</div>

	<div class="socials flex flex-row" slot="navbar-right-alt">
		<SocialLink type="gitHub" href={config.github} />
		<SocialLink type="discord" href={config.discord} />
	</div>

	<div slot="main-top">
		<section id="intro" class="container mt-20 mx-10">
			<div class="flex space-y-24	992:space-y-0 flex-col 992:flex-row">
				<div class="w-2/3">
					<img src="/code-sample.png" alt="Code" />
				</div>
				<div class="w-1/3">
					<h1 class="text-white text-4xl font-bold">API that respects itself</h1>

					<p class="text-blue-500 font-bold py-10">
						FastEndpoints offers a better alternative than the Minimal Api and MVC
					</p>

					with the aim of increasing developer productivity. Performance is on par with the Minimal
					Api and is faster; uses less memory; and does around 45k more requests per second than a
					MVC Controller in a head-to-head comparison.

					<div class="flex space-x-5 my-4">
						<a href={config.github} class="bg-teal-500 px-4 py-2 rounded font-bold">Github</a>
						<a href="/docs" class="bg-blue-500 px-4 py-2 text-white rounded">Get Started</a>
					</div>
				</div>
			</div>
		</section>

		<section id="features" class="mt-20 mx-20">
			<h1 class=" text-4xl font-bold">Features</h1>
			<p class="my-5 text-blue-600">To keep you productive</p>
		</section>
	</div>

	<footer slot="main-bottom" class="text-center">
		<h1 class="text-4xl font-bold">FastEndpoints</h1>
		<p>2022</p>
	</footer>
</KitDocsLayout>
