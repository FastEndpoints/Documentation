import { content } from '$lib/search/server/content';

export function GET() {
    return {
        body: {
            ...content()
        }
    }
}