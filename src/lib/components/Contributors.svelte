<script lang="ts">
	import type { ContributorInfo } from 'src/routes/index.svelte';

	export let contributors: Map<string, ContributorInfo>;
</script>

<section id="contributors">
	<div class="flex flex-col gap-2 mb-12">
		<div class="font-semibold text-feLightBlue-500 text-base">Join us on Github</div>
		<div class="font-bold text-3xl flex items-center gap-4 mb-12">
		Contributors
		<span class="rounded-full min-w-[32px] min-h-[32px] bg-feLightBlue-500 text-feDarkBlue-700 font-extrabold inline-flex items-center text-sm justify-center">
			{contributors.size}
		</span>
	</div>
	<div class="flex flex-wrap gap-4">
		{#each [...contributors] as [username, contributionInfo]}
			<div class="transition ease-in-out duration-300 group bg-feDarkBlue-600 rounded-lg p-4 w-full flex flex-wrap hover:bg-transparent items-center justify-center w-20 h-20">
				<a href={contributionInfo.url} target="_blank">
					<img
							class="transition ease-in-out duration-300 p-1 w-12 h-12 rounded-full ring-4 ring-feDarkBlue-800 bg-feDarkBlue-800 group-hover:ring-feLightBlue-400"
							src={contributionInfo.image}
							alt={username}
					/>
				</a>
			</div>
		{/each}
	</div>
</section>
