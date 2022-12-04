<script lang="ts">
    import SvelteSpotlight from 'svelte-spotlight/SvelteSpotlight.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { SearchResult } from '../../types';

    export let query = "";
    export let results : SearchResult[] = []; 
    export let isOpen = false;

    const dispatch = createEventDispatcher();

    $: onOpenChange(isOpen);
    $: onQueryChange(query);

    function onOpenChange(newIsOpen: boolean) {
      dispatch('openchange', { newIsOpen })
    }

    function onQueryChange(newQuery: string) {
      dispatch('querychange', { newQuery });
    }

    function escape(text: string) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function excerpt(content: string, query: string) {
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) {
            return content.slice(0, 100);
        }

        const prefix = index > 20
            ? `...${content.slice(index - 15, index)}`
            : content.slice(0, index);

        const suffix = content.slice(
            index + query.length,
            index + query.length + (80 - (prefix.length + query.length))
        );

        return (
            escape(prefix) + 
            `<mark>${escape(content.slice(index, index + query.length))}</mark>` +
            escape(suffix)
        );

    }

    function onKeyboardSelect(event: CustomEvent<SearchResult>) {
        dispatch('select', { href: event.detail.href });
    }
</script>

<SvelteSpotlight
    {results}
    bind:query
    bind:isOpen
    modalClass={'w-[600px] max-w-[90%] bg-feDarkBlue-600 shadow-lg rounded-lg'}
    headerClass={'py-3 px-10 border-b-2 border-gray-500 border-b-solid'}
    inputClass="text-gray-50 focus:outline-none bg-transparent"
    contentClass="py-3 [&_li]:py-2"
    resultIdKey="href"
    on:select={(event) => {
        onKeyboardSelect(event);
    }}
>
    <div
       slot="result" 
       let:selected 
       let:result 
       class={`cursor-pointer hover:bg-feDarkBlue-800 text-sm w-full ${selected ? "bg-feDarkBlue-500" : ''} `}
    >
        <a href={result.href} 
            class="ml-10"
            on:click={_ => dispatch('select', { href: result.href })}
        >
            <strong>{@html excerpt(result.title, query)}</strong>
            {#if result.content}
                <div class="mx-10 text-slate-500 text-sm truncate">{@html excerpt(result.content, query)}</div>
            {/if}
        </a>
    </div>

    <div slot="noResults" class="ml-10 text-slate-500 text-sm">
        No results...
    </div>
</SvelteSpotlight>