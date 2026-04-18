import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';

export const GET = createSidebarRequestHandler({
  filter: (file) => file !== '/docs/swagger-support.md'
});
