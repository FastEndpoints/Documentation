<script lang="ts" context="module">
    import type {Load} from '@sveltejs/kit';

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
    import GithubBadges from '$lib/components/GithubBadges.svelte';
    import Sponsors from '$lib/components/Sponsors.svelte';
    import Contributors from '$lib/components/Contributors.svelte';
    import FeatureList from '$lib/components/FeatureList.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import SEO from '$lib/components/SEO.svelte';

    import {Button, Chip, KitDocsLayout, SocialLink} from '@svelteness/kit-docs';
    import '@svelteness/kit-docs/client/polyfills/index.js';
    import '@svelteness/kit-docs/client/styles/fonts.css';
    import {onMount} from 'svelte';

    import {getContributors} from '$lib/api';
    import '../app.css';
    import {config, navbar} from '../config';
    import '../vars.css';

    import Highlight from 'svelte-highlight';
    // @ts-ignore
    import csharp from 'svelte-highlight/languages/csharp';
    // @ts-ignore
    import atomOneDark from 'svelte-highlight/styles/atom-one-dark';

    const tab = '\t\t';
    const myRequest = `public class MyRequest \n{\n\tpublic string FirstName { get; set; }\n\tpublic string LastName { get; set; } \n}`;
    const myResponse =
        'public class MyResponse \n{\n\tpublic string FullName { get; set; }\n\tpublic string Message { get; set; } \n}';
    const myEndpoint = `public class MyEndpoint : Endpoint<MyRequest, MyResponse>\n{\n${tab}public override void Configure()\n${tab}{\n${tab.repeat(
        2
    )}Post(\"/hello/world\");\n${tab.repeat(
        2
    )}AllowAnonymous();\n${tab}}\n\n${tab}public override async Task HandleAsync(MyRequest r, CancellationToken c)\n${tab}{\n${tab.repeat(
        2
    )}await Send.ResponseAsync(new()\n${tab.repeat(2)}{\n${tab.repeat(
        3
    )}FullName = $\"{r.FirstName} {r.LastName}\",\n${tab.repeat(
        3
    )}Message = \"Welcome to FastEndpoints...\"${tab.repeat(2)}\n${tab.repeat(2)}});\n${tab}}\n}`;

    export let contributors: Map<string, ContributorInfo>;

    onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<SEO/>

<KitDocsLayout isSidebarOpen={false} {navbar} sidebar={null}>
    <div class="logo flex gap-4 items-center" slot="navbar-left">
        <div class="px-1 max-w-[185px] min-w-[185px] mt-2">
            <Button href="/" class="w-full">
                <Logo/>
            </Button>
        </div>
        <Chip class="text-center !h-auto hidden 420:inline-flex">Build Performant APIs Fast!</Chip>
    </div>

    <div class="socials flex flex-row" slot="navbar-right-alt">
        <SocialLink type="gitHub" href={config.github}/>
        <SocialLink type="discord" href={config.discord}/>
    </div>
    <div slot="main-top">
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
                        <div class="rounded-lg col-span-2 1200:col-span-1 bg-feDarkBlue-600">
                            <Highlight language={csharp} code={myRequest}/>
                        </div>
                        <div class="rounded-lg col-span-2 1200:col-span-1 bg-feDarkBlue-600">
                            <Highlight language={csharp} code={myResponse}/>
                        </div>
                        <div class="rounded-lg col-span-2 bg-feDarkBlue-600">
                            <Highlight language={csharp} code={myEndpoint}/>
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
                <Contributors {contributors}/>
            </div>
        </div>
    </div>

    <footer slot="main-bottom">
        <div class="border-b-2 border-feDarkBlue-600 mb-6 h-1 w-full"/>
        <div class="flex justify-between items-center">
            <div class="prose text-sm">© FastEndpoints {new Date().getFullYear()}</div>
            <Button href="/" class="max-w-[145px]">
                <Logo/>
            </Button>
        </div>
    </footer>
</KitDocsLayout>