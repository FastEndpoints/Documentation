<script lang="ts">
	import type { ContributorInfo } from 'src/routes/index.svelte';

	export let contributors: Map<string, ContributorInfo>;
</script>

<section id="contributors">
	<h1 class="text-feLightBlue-500 font-bold text-4xl">
		Contributors
		<span class="font-semibold text-feLightBlue-500 text-xl">({contributors.size})</span>
	</h1>
	<p class="my-5">
		FastEndpoints is free and open source software, made possible by the work of supporters.
	</p>
	<p class="my-5 font-semibold text-feLightBlue-500 text-xl">Join us on GitHub</p>

	<div class="grid grid-cols-2 576:grid-cols-3 768:grid-cols-4 992:grid-cols-8 p-5 gap-1">
		{#each [...contributors] as [username, contributionInfo]}
			<a href={contributionInfo.url}>
				<img
					class="p-1 w-12 h-12 rounded-full ring-2 ring-gray-300"
					src={contributionInfo.image}
					alt={username}
				/>
			</a>
		{/each}
	</div>
</section>
