<script lang="ts">
	import { onMount } from 'svelte';
	import type { Heading } from '$lib/content/types';

	export let headings: Heading[] = [];
	export let placement: 'desktop' | 'mobile' = 'desktop';

	let activeSlug = '';
	let clickedSlug = '';
	$: visible = headings.filter((heading) => heading.level > 1 && heading.level < 5);
	$: baseLevel = visible.length ? Math.min(...visible.map((heading) => heading.level)) : 2;

	function selectHeading(slug: string) {
		clickedSlug = slug;
		activeSlug = slug;
	}

	onMount(() => {
		let frame = 0;

		function getActiveOffset() {
			const scrollPaddingTop = parseFloat(
				getComputedStyle(document.documentElement).scrollPaddingTop
			);
			return Number.isFinite(scrollPaddingTop) ? scrollPaddingTop + 1 : 120;
		}

		function updateActiveHeading() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				if (clickedSlug) {
					activeSlug = clickedSlug;
					return;
				}

				const offset = getActiveOffset();
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

		function syncHashSelection() {
			const hash = window.location.hash.slice(1);
			if (visible.some((heading) => heading.slug === hash)) {
				selectHeading(hash);
			} else {
				updateActiveHeading();
			}
		}

		function clearClickedSelection() {
			if (!clickedSlug) return;
			clickedSlug = '';
			updateActiveHeading();
		}

		syncHashSelection();
		window.addEventListener('scroll', updateActiveHeading, { passive: true });
		window.addEventListener('hashchange', syncHashSelection);
		window.addEventListener('wheel', clearClickedSelection, { passive: true });
		window.addEventListener('touchstart', clearClickedSelection, { passive: true });
		window.addEventListener('keydown', clearClickedSelection);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', updateActiveHeading);
			window.removeEventListener('hashchange', syncHashSelection);
			window.removeEventListener('wheel', clearClickedSelection);
			window.removeEventListener('touchstart', clearClickedSelection);
			window.removeEventListener('keydown', clearClickedSelection);
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
					onclick={() => selectHeading(heading.slug)}
				>
					{#if heading.level > baseLevel}
						<span class="on-this-page__prefix" style="margin-left:0.5em" aria-hidden="true">›</span>
					{/if}
					<span class="on-this-page__text">{heading.text}</span>
				</a>
			{/each}
		</nav>
	</aside>
{/if}