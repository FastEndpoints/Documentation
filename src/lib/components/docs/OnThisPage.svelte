<script lang="ts">
	import { onMount } from 'svelte';
	import type { Heading } from '$lib/content/types';

	export let headings: Heading[] = [];
	export let placement: 'desktop' | 'mobile' = 'desktop';

	let activeSlug = '';
	$: visible = headings.filter((heading) => heading.level > 1 && heading.level < 4);

	onMount(() => {
		let frame = 0;

		function updateActiveHeading() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const offset = 120;
				let current = visible[0]?.slug ?? '';

				for (const heading of visible) {
					const element = document.getElementById(heading.slug);
					if (!element) continue;

					if (element.getBoundingClientRect().top <= offset) {
						current = heading.slug;
					} else {
						break;
					}
				}

				activeSlug = current;
			});
		}

		activeSlug = window.location.hash.slice(1) || visible[0]?.slug || '';
		updateActiveHeading();
		window.addEventListener('scroll', updateActiveHeading, { passive: true });
		window.addEventListener('hashchange', updateActiveHeading);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', updateActiveHeading);
			window.removeEventListener('hashchange', updateActiveHeading);
		};
	});
</script>

{#if visible.length}
	<aside class={`on-this-page on-this-page--${placement}`}>
		<p>On This Page</p>
		<nav aria-label="On this page">
			{#each visible as heading}
				<a
					href={`#${heading.slug}`}
					class={`level-${heading.level}`}
					class:active={activeSlug === heading.slug}
				>
					<span>{heading.text}</span>
				</a>
			{/each}
		</nav>
	</aside>
{/if}