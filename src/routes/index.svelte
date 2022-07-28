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

<svelte:head>
	{@html atomOneDark}
</svelte:head>

<script lang="ts">
	import Contributors from '$lib/components/Contributors.svelte';
	import FeatureList from '$lib/components/FeatureList.svelte';
	import SEO from '$lib/components/SEO.svelte';

	import { KitDocsLayout, SocialLink, Chip } from '@svelteness/kit-docs';
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';
	import { onMount } from 'svelte';

	import { getContributors } from '$lib/api';
	import '../app.css';
	import { config, navbar } from '../config';
	import '../vars.css';

	import Highlight from "svelte-highlight";
	import csharp from "svelte-highlight/languages/csharp";
	import atomOneDark from "svelte-highlight/styles/atom-one-dark";

	const tab = "\t\t";
	const myRequest = `public class MyRequest \n{\n${tab}public string FirstName { get; set; }\n\t\tpublic string LastName { get; set; } \n}`;
	const myResponse = "public class MyResponse \n{\n\t\tpublic string FullName { get; set; }\n\t\tpublic string Message { get; set; } \n}";
	const myEndpoint = `public class MyEndpoint : Endpoint<MyRequest, MyResponse>\n{\n${tab}public override void Configure()\n${tab}{\n${tab.repeat(2)}Post(\"/hello/world\");\n${tab.repeat(2)}AllowAnonymous();\n${tab}}\n\n${tab}public override async Task HandleAsync(MyRequest r, CancellationToken c)\n${tab}{\n${tab.repeat(2)}await SendAsync(new()\n${tab.repeat(2)}{\n${tab.repeat(3)}FullName = $\"{r.FirstName} {r.LastName}\",\n${tab.repeat(3)}Message = \"Welcome to FastEndpoints...\"${tab.repeat(2)} \n ${tab.repeat(2)}}\n\n${tab}}\n}`;

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
		<Chip>Build Performant APIs Fast!</Chip>
	</div>

	<div class="socials flex flex-row" slot="navbar-right-alt">
		<SocialLink type="gitHub" href={config.github} />
		<SocialLink type="discord" href={config.discord} />
	</div>

	<div slot="main-top">
		<div>
			<div class="flex flex-col 1200:flex-row 1200:flex-row-reverse mt-2 1200: mt-12 my-28 gap-12 items-center">
				<div class="768:w-2/3">
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
							<SocialLink type="gitHub" href={config.github}>Star us on Github</SocialLink>
							<a
									href="/docs/get-started"
									class="text-gray-200 bg-gradient-to-tr from-feLightBlue-600 to-feBlue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-feLightBlue-300 dark:focus:ring-feLightBlue-600 font-medium rounded-md text-sm px-5 shadow-md shadow-feBlue-500/20 hover:shadow-lg hover:shadow-feBlue-700/40 py-2.5 text-center uppercase mr-2 mb-2 active:opacity-[0.85]"
							>Get Started</a
							>
						</div>
					</div>
				</div>
				<div class="w-full h-full">
					<div class="grid [200px_minmax(900px,_1fr)_100px] grid-cols-2 gap-6 ">
						<div class="rounded-lg col-span-2 1200:col-span-1 bg-feDarkBlue-600 h-[100px]">
							<Highlight language={csharp} code={myRequest} />
						</div>
						<div class="rounded-lg col-span-2 1200:col-span-1 bg-feDarkBlue-600 h-[100px]">
							<Highlight language={csharp} code={myResponse} />
						</div>
						<div class="rounded-lg col-span-2 bg-feDarkBlue-600 ">
							<Highlight language={csharp} code={myEndpoint} />
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