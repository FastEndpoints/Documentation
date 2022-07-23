<script lang="ts">
	import { page } from '$app/stores';
	import { Button, colorScheme, KitDocsLayout, SocialLink } from '@svelteness/kit-docs';
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import '@svelteness/kit-docs/client/styles/vars.css';
	import '../app.css';
	import { config, navbar } from '../config';
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
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={'config.twitter'} />
	<meta name="twitter:title" content={config.seo.title} />
	<meta name="twitter:description" content={config.seo.description} />
	<meta name="twitter:image" content={'twImage'} />
	<!-- Robots -->
	<!-- <meta name="robots" content="index,follow" /> -->
	<!-- <meta name="googlebot" content="index,follow" /> -->
</svelte:head>

<KitDocsLayout isSidebarOpen={false} {navbar} sidebar={null}>
	<div class="logo" slot="navbar-left">
		{#if $colorScheme === 'dark'}
			<Button href="/">
				<img src={'/icon-dark.png'} alt="Logo" />
			</Button>
		{:else if $colorScheme === 'light'}
			<Button href="/">
				<img src={'/icon-light.png'} alt="Logo" />
			</Button>
		{/if}
	</div>

	<div class="socials flex flex-row" slot="navbar-right-alt">
		<SocialLink type="gitHub" href={config.github} />
		<SocialLink type="discord" href={config.discord} />
	</div>

	<div slot="main-top">
		<section id="intro" class="container mt-20 mx-20">
			<div id="a" class="flex justify-between ">
				<div class="w-1/3 ">
					{#if $colorScheme === 'dark'}
						<img src="/code-sample-dark.png" alt="Code" />
					{:else if $colorScheme === 'light'}
						<img src="/code-sample-light.png" alt="Code" />
					{/if}
				</div>
				<div class="w-1/3">
					<p class="text-white text-2xl">APIs that respects itself</p>

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
