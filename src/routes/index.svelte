<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export type ContributorInfo = {
		image: string;
		contributions: number;
		url: string;
	};

	export const load: Load = async () => {
		const [framework, docs] = await Promise.all([
			getContributors('FastEndpoints'),
			getContributors('FastEndpoints-DocSite')
		]);

		const contributors = [...docs, ...framework]
			.sort((a, b) => b.contributions - a.contributions)
			.reduce((acc, current) => {
				let contributionInfo: ContributorInfo | undefined;
				let contributor = acc.get(current.login);

				if (!contributor) {
					contributionInfo = {
						url: current.html_url,
						contributions: 0,
						image: current.avatar_url
					};
				} else {
					contributionInfo = contributor;
				}

				contributionInfo.contributions += current.contributions;

				acc.set(current.login, contributionInfo);

				return acc;
			}, new Map<string, ContributorInfo>());

		return {
			cache: {
				maxage: 3600
			},
			props: {
				contributors
			}
		};
	};
</script>

<script lang="ts">
	import Contributors from '$lib/components/Contributors.svelte';
	import FeatureList from '$lib/components/FeatureList.svelte';
	import SEO from '$lib/components/SEO.svelte';

	import { KitDocsLayout, SocialLink } from '@svelteness/kit-docs';
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import { onMount } from 'svelte';

	import { getContributors } from '$lib/api';
	import '../app.css';
	import { config, navbar } from '../config';
	import '../vars.css';

	export let contributors: Map<string, ContributorInfo>;

	onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<SEO />

<KitDocsLayout isSidebarOpen={false} {navbar} sidebar={null}>
	<div class="logo s-Fa-w7UE9mF1Z flex gap-4 items-center" slot="navbar-left">
		<a
			class="group transform-gpu text-lg font-medium transition-transform hover:scale-105"
			href="/"
		>
			<span
				class="inline-block transform transition-transform duration-100 group-hover:translate-x-0"
			>
				<img src="/logo.png" alt="FastEndpoints logo" class="s-Fa-w7UE9mF1Z max-w-[185px]" />
			</span>
		</a>

		<span
			class="text-center bg-feBlue-100 text-feBlue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-feLightBlue-500 dark:text-feDarkBlue-800"
		>
			Build Performant APIs Fast!
		</span>
	</div>

	<div class="socials flex flex-row" slot="navbar-right-alt">
		<SocialLink type="gitHub" href={config.github} />
		<SocialLink type="discord" href={config.discord} />
	</div>

	<div slot="main-top">
		<div>
			<div class="flex flex-col 992:flex-row mt-2 mb-28 992:mt-28 gap-12 items-center my-44">
				<div class="w-full h-full order-2 992:order-none">
					<div class="grid grid-rows-2 grid-cols-2 gap-4 h-full">
						<div class="request rounded-lg col-span-1 bg-feDarkBlue-600 h-[100px]" />
						<div class="response rounded-lg col-span-1 bg-feDarkBlue-600" />
						<div class="endpoint rounded-lg col-span-2 w-full bg-feDarkBlue-600" />
					</div>
				</div>
				<div class="w-full">
					<div class="flex flex-col gap-2">
						<div class="font-semibold text-feLightBlue-500 text-base">
							ASP.NET Minimal APIs Made Easy...
						</div>
						<div class="font-bold text-3xl mb-4">
							FastEndpoints is a developer friendly alternative to Minimal APIs & MVC
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
								Performance is on par with Minimal APIs. Is faster, uses less memory and does around <a
									href="/benchmarks">45k more requests per second</a
								> than a MVC Controller in our benchmarks.
							</p>
						</div>
						<div class="flex flex-row gap-8 mt-8">
							<a
								href={config.github}
								target="_blank"
								class="flex items-center justify-center py-2 space-x-2 text-sm font-semibold text-gray-300 hover:text-gray-200 rounded-md focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-gray-600"
							>
								<svg
									width="28"
									height="28"
									preserveAspectRatio="xMidYMid meet"
									viewBox="0 0 24 24"
									class=""
									><path
										fill="currentColor"
										d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
									/></svg
								>
								<span>Star On Github</span>
							</a>
							<a
								href="/docs/get-started"
								class="text-gray-200 bg-gradient-to-tr from-feLightBlue-600 to-feBlue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-feLightBlue-300 dark:focus:ring-feLightBlue-600 font-medium rounded-md text-sm px-5 shadow-md shadow-feBlue-500/20 hover:shadow-lg hover:shadow-feBlue-700/40 py-2.5 text-center uppercase mr-2 mb-2 active:opacity-[0.85]"
								>Get Started</a
							>
						</div>
					</div>
				</div>
			</div>
			<div class="border-b-2 border-feDarkBlue-600" />
			<div class="my-28">
				<FeatureList />
			</div>
			<div class="border-b-2 border-feDarkBlue-600" />
			<div class="my-28">
				<Contributors {contributors} />
			</div>
		</div>
	</div>

	<footer slot="main-bottom">
		<div class="border-b-2 border-feDarkBlue-600 mb-6 h-1 w-full" />
		<div class="flex justify-between items-center">
			<div class="prose text-sm">© FastEndpoints 2022</div>
			<div class="logo s-Fa-w7UE9mF1Z">
				<a
					class="group transform-gpu text-lg font-medium transition-transform hover:scale-105"
					href="/"
				>
					<span
						class="inline-block transform transition-transform duration-100 group-hover:translate-x-0"
					>
						<img src="/logo.png" alt="FastEndpoints logo" class="s-Fa-w7UE9mF1Z max-w-[145px]" />
					</span>
				</a>
			</div>
		</div>
	</footer>
</KitDocsLayout>
