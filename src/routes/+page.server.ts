import type { PageServerLoad } from './$types';
import { getContributors } from '$lib/api';

export type ContributorInfo = {
	image: string;
	contributions: number;
	url: string;
};

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=3600' });

	const [framework, docs] = await Promise.all([
		getContributors('FastEndpoints'),
		getContributors('FastEndpoints-DocSite')
	]);

	const contributors = [...docs, ...framework]
		.sort((a, b) => b.contributions - a.contributions)
		.reduce((acc, current) => {
			const contributionInfo = acc.get(current.login) ?? {
				url: current.html_url,
				contributions: 0,
				image: current.avatar_url
			};

			contributionInfo.contributions += current.contributions;
			acc.set(current.login, contributionInfo);
			return acc;
		}, new Map<string, ContributorInfo>());

	return {
		contributors: Array.from(contributors.entries()).map(([login, info]) => ({ login, ...info }))
	};
};
