import type { NavbarConfig } from '@svelteness/kit-docs';

type Config = {
	siteUrl: string;
	seo: {
		title: string;
		description: string;
		keywords: string[];
	};
	openGraph: {
		title: string;
		url: string;
		siteName: string;
		type: string;
		description: string;
		locale: string;
	};
	twitter: {};
	github: string;
	discord: string;
	algolia: {
		apiKey: string;
		appId: string;
	};
};

export const config = Object.freeze<Config>({
	siteUrl: 'https://fast-endpoints.com/',
	seo: {
		title: 'FastEndpoints',
		description:
			'A light-weight REST Api framework for ASP.Net 6 that implements REPR (Request-Endpoint-Response) Pattern.',
		keywords: ['fastendpoints', '.net', '.net6', 'csharp', 'dotnet', 'web', 'backend']
	},
	openGraph: {
		title: '',
		url: 's',
		siteName: 's',
		type: 'description',
		description: 'description',
		locale: 'en'
	},
	twitter: {},
	github: 'https://github.com/dj-nitehawk/FastEndpoints',
	discord: 'https://discord.com/invite/yQZ4uvfF2E',
	algolia: {
		apiKey: '599cec31baffa4868cae4e79f180729b',
		appId: 'R2IYF7ETH7'
	}
});

// Navigation
export const navbar: NavbarConfig = {
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
