export const sidebarGroups = [
	{ id: 'getting-started', title: 'Getting Started' },
	{ id: 'rest-apis', title: 'REST APIs' },
	{ id: 'messaging', title: 'Messaging' },
	{ id: 'tooling', title: 'Tooling' },
	{ id: 'guides', title: 'Guides' }
] as const;

export type SidebarGroupId = (typeof sidebarGroups)[number]['id'];

const groupIds = new Set<string>(sidebarGroups.map((group) => group.id));

export function isSidebarGroupId(value: unknown): value is SidebarGroupId {
	return typeof value === 'string' && groupIds.has(value);
}
