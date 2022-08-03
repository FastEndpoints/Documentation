<script type="ts">
	import { page } from '$app/stores';
	import { config } from '../../config';

	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
</script>

<svelte:head>
	{#if !title}
		<title>{config.seo.title}</title>
	{:else}
		<title>{title}</title>
	{/if}

	{#if !description}
		<meta property="description" content={config.seo.description} />
	{:else}
		<meta property="description" content={description} />
	{/if}

	<link rel="canonical" href={`${config.siteUrl}${$page.url.pathname}`} />
	<meta name="keywords" content={config.seo.keywords.join(', ')} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<!-- OG -->
	<meta property="og:url" content={`${config.siteUrl}`} />
	<meta property="og:image" content={`${config.siteUrl}${config.openGraph.image}`} />
	<meta property="og:type" content={config.openGraph.type} />
	<meta property="og:site_name" content={config.openGraph.siteName} />
	<meta property="og:description" content={config.openGraph.description} />
	<meta property="og:title" content={config.openGraph.title} />
	<meta property="og:locale" content={config.openGraph.locale} />
	<!-- Robots -->
	<meta name="robots" content="index,follow" />
	<meta name="googlebot" content="index,follow" />
</svelte:head>
