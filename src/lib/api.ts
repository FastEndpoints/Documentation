export type Contributor = {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	contributions: number;
};

type Repository = 'FastEndpoints' | 'FastEndpoints-DocSite';

export const getContributors = async (repo: Repository) => {
	const response = await fetch(`https://api.github.com/repos/dj-nitehawk/${repo}/contributors`);

	return response.json() as Promise<Contributor[]>;
};
