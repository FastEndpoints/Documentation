<script context="module" lang="ts">
    import type {Load} from '@sveltejs/kit';

    export const prerender = true;

    export const load: Load = () => ({
        status: 307,
        redirect: '/docs/get-started'
    });
</script>