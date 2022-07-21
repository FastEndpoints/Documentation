type Config = {
	siteUrl: string;
	seo: {
		title: string;
		description: string;
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
		title: 's',
		description:
			'A light-weight REST Api framework for ASP.Net 6 that implements REPR (Request-Endpoint-Response) Pattern.'
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
