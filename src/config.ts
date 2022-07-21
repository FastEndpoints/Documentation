type Config = {
	siteUrl: string;
	seo: {
		title: '';
		description: '';
	};
	github: string;
	discord: string;
	algolia: {
		apiKey: string;
		appId: string;
		indexName: string;
	};
};

export const config = Object.freeze<Config>({
	siteUrl: 'https://fast-endpoints.com/',
	seo: {
		title: '',
		description: ''
	},
	github: 'https://github.com/dj-nitehawk/FastEndpoints',
	discord: 'https://discord.com/invite/yQZ4uvfF2E',
	algolia: {
		apiKey: '',
		appId: '',
		indexName: ''
	}
});
