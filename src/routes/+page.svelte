<script lang="ts">
	import GithubBadges from '$lib/components/GithubBadges.svelte';
	import Sponsors from '$lib/components/Sponsors.svelte';
	import Contributors from '$lib/components/Contributors.svelte';
	import FeatureList from '$lib/components/FeatureList.svelte';
	import SocialLink from '$lib/components/site/SocialLink.svelte';
	import type { ContributorInfo } from '$lib/types/contributor';
	import { config } from '../config';
	import hljs from 'highlight.js/lib/core';
	import csharp from 'highlight.js/lib/languages/csharp';
	import 'highlight.js/styles/atom-one-dark.css';

	export let data: { contributors: ContributorInfo[] };

	hljs.registerLanguage('csharp', csharp);

	function highlightCsharp(code: string) {
		return hljs.highlight(code, { language: 'csharp' }).value;
	}

	const tab = '\t\t';
	const myRequest = `public class MyRequest \n{\n\tpublic string FirstName { get; set; }\n\tpublic string LastName { get; set; } \n}`;
	const myResponse =
		'public class MyResponse \n{\n\tpublic string FullName { get; set; }\n\tpublic string Message { get; set; } \n}';
	const myEndpoint = `public class MyEndpoint : Endpoint<MyRequest, MyResponse>\n{\n${tab}public override void Configure()\n${tab}{\n${tab.repeat(
		2
	)}Post("/hello/world");\n${tab.repeat(
		2
	)}AllowAnonymous();\n${tab}}\n\n${tab}public override async Task HandleAsync(MyRequest r, CancellationToken c)\n${tab}{\n${tab.repeat(
		2
	)}await Send.OkAsync(new()\n${tab.repeat(2)}{\n${tab.repeat(
		3
	)}FullName = $"{r.FirstName} {r.LastName}",\n${tab.repeat(
		3
	)}Message = "Welcome to FastEndpoints..."${tab.repeat(2)}\n${tab.repeat(2)}});\n${tab}}\n}`;
</script>

<main class="site-main home-page">

        <div>
            <div class="flex flex-col 1200:flex-row 1200:flex-row-reverse mt-4 mb-10 gap-6 items-center">
                <div class="">
                    <div class="flex flex-col gap-2">
                        <GithubBadges/>
                        <h1 class="!font-semibold !text-feLightBlue-500 !text-base mt-2">
                            ASP.NET Minimal APIs Made Easy...
                        </h1>
                        <h2 class="!font-bold !text-3xl !mb-4">
                            FastEndpoints is a developer friendly alternative to Minimal APIs & MVC
                        </h2>
                        <div class="prose intro">
                            <p>
                                It nudges you towards the
                                <a target="_blank" href="https://deviq.com/design-patterns/repr-design-pattern">
                                    REPR Design Pattern (Request-Endpoint-Response)
                                </a>
                                for convenient & maintainable endpoint creation with virtually no boilerplate.
                            </p>
                            <p>
                                Performance is on par with Minimal APIs and does noticeably better than MVC Controllers in
                                synthetic <a title="Benchmarks" href="/benchmarks">benchmarks</a>.
                            </p>
                        </div>
                        <div class="flex flex-row gap-4 mt-5">
                            <SocialLink type="gitHub" href={config.github} class="text-sm"
                            >Star on Github
                            </SocialLink
                            >
                            <a
                                    href="/docs/get-started"
                                    class="text-gray-200 bg-gradient-to-tr from-feLightBlue-600 to-feBlue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-feLightBlue-300 dark:focus:ring-feLightBlue-600 font-medium rounded-md text-sm px-5 shadow-md shadow-feBlue-500/20 hover:shadow-lg hover:shadow-feBlue-700/40 py-2.5 text-center uppercase mr-2 mb-2 active:opacity-[0.85]"
                            >Get Started</a
                            >
                        </div>
                    </div>
                </div>
                <div class="w-full h-full min-w-fit">
                    <div class="grid [200px_minmax(900px,_1fr)_100px] grid-cols-2 gap-[0.4rem]">
                        <div class="rounded-lg col-span-2 1200:col-span-1 overflow-hidden bg-feDarkBlue-600">
                            <pre class="hljs"><code>{@html highlightCsharp(myRequest)}</code></pre>
                        </div>
                        <div class="rounded-lg col-span-2 1200:col-span-1 overflow-hidden bg-feDarkBlue-600">
                            <pre class="hljs"><code>{@html highlightCsharp(myResponse)}</code></pre>
                        </div>
                        <div class="rounded-lg col-span-2 overflow-hidden bg-feDarkBlue-600">
                            <pre class="hljs"><code>{@html highlightCsharp(myEndpoint)}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-7">
                <Sponsors/>
            </div>
            <div class="my-7">
                <FeatureList/>
            </div>
            <div class="my-10">
                <Contributors contributors={data.contributors}/>
            </div>
        </div>
    
</main>

<style>
	:global(.home-page pre.hljs) {
		margin: 0;
		padding: 1rem;
		background: #141a24;
	}

	:global(.home-page pre.hljs code) {
		display: block;
		border-radius: 0;
		background: transparent !important;
	}
</style>
