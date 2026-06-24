<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { SearchResult } from '../../types';

	export let query = '';
	export let results: SearchResult[] = [];
	export let isOpen = false;

	let input: HTMLInputElement;
	let selectedIndex = 0;
	const dispatch = createEventDispatcher<{
		openchange: { newIsOpen: boolean };
		querychange: { newQuery: string };
		select: { href: string };
	}>();

	$: if (isOpen) {
		tick().then(() => input?.focus());
	}
	$: dispatch('querychange', { newQuery: query });
	$: if (selectedIndex >= results.length) selectedIndex = 0;

	function escape(text: string) {
		return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function excerpt(content: string, currentQuery: string) {
		const safeQuery = currentQuery.trim();
		if (!safeQuery) return escape(content.slice(0, 100));
		const index = content.toLowerCase().indexOf(safeQuery.toLowerCase());
		if (index === -1) return escape(content.slice(0, 100));

		const prefix = index > 20 ? `...${content.slice(index - 15, index)}` : content.slice(0, index);
		const suffix = content.slice(index + safeQuery.length, index + safeQuery.length + 80);

		return `${escape(prefix)}<mark>${escape(content.slice(index, index + safeQuery.length))}</mark>${escape(suffix)}`;
	}

	function close() {
		dispatch('openchange', { newIsOpen: false });
	}

	function select(result: SearchResult) {
		dispatch('select', { href: result.href });
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = results.length ? (selectedIndex + 1) % results.length : 0;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = results.length ? (selectedIndex - 1 + results.length) % results.length : 0;
		}
		if (event.key === 'Enter' && results[selectedIndex]) {
			event.preventDefault();
			select(results[selectedIndex]);
		}
	}
</script>

{#if isOpen}
	<button type="button" class="sl-overlay fixed inset-0 z-40 bg-black/70" aria-label="Close search" on:click={close}></button>
	<section class="fixed z-50 top-[10vh] left-1/2 -translate-x-1/2 w-[600px] max-w-[90%] bg-feDarkBlue-600 shadow-lg rounded-lg overflow-hidden" role="dialog" aria-modal="true">
		<input
			bind:this={input}
			bind:value={query}
			on:keydown={keydown}
			class="w-full py-3 px-10 border-b-2 border-gray-500 border-b-solid text-gray-50 focus:outline-none bg-transparent"
			placeholder="Search docs..."
		/>
		<ul class="py-3 max-h-[60vh] overflow-y-auto">
			{#if results.length === 0}
				<li class="mx-10 text-slate-500 text-sm">No results...</li>
			{:else}
				{#each results as result, index (result.href)}
					<li class={`[&_mark]:bg-feLightBlue-600 hover:bg-feDarkBlue-800 text-sm ${index === selectedIndex ? 'bg-feDarkBlue-500' : ''}`}>
						<a href={result.href} class="block mx-10 py-2" on:click|preventDefault={() => select(result)}>
							<strong>{@html excerpt(result.title, query)}</strong>
							{#if result.content}
								<div class="text-slate-500 text-sm truncate">{@html excerpt(result.content, query)}</div>
							{/if}
						</a>
					</li>
				{/each}
			{/if}
		</ul>
	</section>
{/if}
