<script lang="ts">
    import {onMount} from 'svelte';

    onMount(() => document.querySelector('[slot="navbar-right-alt"]')?.nextElementSibling?.remove());
</script>

<slot/>

<svelte:head>
    <script async src="https://widget.gurubase.io/widget.latest.min.js" data-widget-id="CuB5Js_zbgA-TFkBZ28oStD0LP2SdKw6iFgIpgAXWT8" data-text="Ask AI"
            data-light-mode="false" id="guru-widget-id">
    </script>
</svelte:head>