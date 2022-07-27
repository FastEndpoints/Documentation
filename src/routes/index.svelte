<script lang="ts">
	import { page } from '$app/stores';
	import { Button, KitDocsLayout, SocialLink } from '@svelteness/kit-docs';
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import { onMount } from 'svelte';
	import '../app.css';
	import { config, navbar } from '../config';
	import '../vars.css';

	import FeatureList from '../components/feature-list.svelte';

	onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<svelte:head>
	<title>{config.seo.title}</title>
	<meta name="description" content={config.seo.description} />
	<meta name="keywords" content={config.seo.keywords.join(', ')} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
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
	<div class="logo s-Fa-w7UE9mF1Z flex gap-4 items-center" slot="navbar-left">
		<a
			class="group transform-gpu text-lg font-medium transition-transform hover:scale-105"
			href="/"
		>
			<span
				class="inline-block transform transition-transform duration-100 group-hover:translate-x-0"
			>
				<img src="/logo.png" alt="FastEndpoints logo" class="s-Fa-w7UE9mF1Z" />
			</span>
		</a>
		<div class="prose text-xs font-semibold uppercase bg-feDarkBlue-600 px-4 py-2 mr-2 rounded-lg">
			Build Performant APIs Fast!
		</div>
	</div>

	<div class="socials flex flex-row" slot="navbar-right-alt">
		<SocialLink type="gitHub" href={config.github} />
		<SocialLink type="discord" href={config.discord} />
	</div>

	<div slot="main-top">
		<div>
			<div class="flex gap-16 h-96 items-center my-44">
				<div class="w-full h-full">
					<div class="grid grid-rows-2 grid-cols-2 gap-4 h-full">
						<div class="request rounded-lg col-span-1 bg-feDarkBlue-600" />
						<div class="response rounded-lg col-span-1 bg-feDarkBlue-600" />
						<div class="endpoint rounded-lg col-span-2 w-full bg-feDarkBlue-600" />
					</div>
				</div>
				<div class="w-full">
					<div class="flex flex-col gap-4">
						<div class="font-semibold text-feLightBlue-500 text-base">
							A Light-Weight REST API Framework For ASP.Net 6
						</div>
						<div class="font-bold text-3xl">
							FastEndpoints is a developer friendly alternative to Minimal API & MVC
						</div>
						<div class="prose intro">
							<p>
								It nudges you towards the
								<a target="_blank" href="https://deviq.com/design-patterns/repr-design-pattern">
									REPR Design Pattern (Request-Endpoint-Response)
								</a>
								for convenient & maintainable endpoint creation with virtually no boilerplate.
							</p>
							<p>
								Performance is on par with Minimal Api. Is faster, uses less memory and does around <a
									href="/benchmarks">45k more requests per second</a
								> than a MVC Controller in our benchmarks.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="my-44">
				<div class="flex flex-col gap-4 mb-12">
					<div class="font-semibold text-feLightBlue-500 text-base">Rapid Development</div>
					<div class="font-bold text-4xl">Using These Handy Features</div>
				</div>
				<FeatureList />
			</div>
		</div>
	</div>
	<div class="border-t-2 border-feDarkBlue-700 mb-6" />
	<footer slot="main-bottom" class="flex justify-between items-center">
		<div class="prose text-sm">© FastEndpoints 2022</div>
		<div class="logo s-Fa-w7UE9mF1Z">
			<a
				class="group transform-gpu text-lg font-medium transition-transform hover:scale-105"
				href="/"
			>
				<span
					class="inline-block transform transition-transform duration-100 group-hover:translate-x-0"
				>
					<img src="/logo.png" alt="FastEndpoints logo" class="s-Fa-w7UE9mF1Z" />
				</span>
			</a>
		</div>
	</footer>
</KitDocsLayout>

<style>
	.logo img {
		width: 185px;
	}
</style>
