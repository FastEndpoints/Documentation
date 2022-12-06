<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';

    // The whole purpose of this component is to create a dependency on the 
    // /search.json endpoint via the load function so that /search.json is 
    // pregenerated during build and bundled as a static json resource
    export const load: Load = async ({ fetch }) => {
        const response = await fetch('/search.json');
        const { blocks } = await response.json();

        return {
            props: { blocks }
        }
    }
</script>

<script lang="ts">
    import type { SearchNode } from '$lib/search/types';

    export let blocks : SearchNode[];
</script>

<pre>
    {JSON.stringify(blocks)}
</pre>