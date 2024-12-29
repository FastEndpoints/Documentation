<script lang="ts">
    import type {ContributorInfo} from 'src/routes/index.svelte';

    export let contributors: Map<string, ContributorInfo>;
</script>

<section id="contributors">
    <div class="flex flex-col gap-2 mb-12">
        <div class="font-semibold text-feLightBlue-500 text-base">Made Possible By</div>
        <div class="font-bold text-3xl flex items-center gap-4 ">
            Our Community Of Code Heroes
            <span class="rounded-full min-w-[32px] min-h-[32px] bg-feLightBlue-500 text-feDarkBlue-700 font-extrabold inline-flex items-center text-sm justify-center">
				{contributors.size}
			</span>
        </div>
        <div class="mt-3 mb-1">

        </div>
        <div class="flex flex-wrap gap-4">
            {#each [...contributors] as [username, contributionInfo]}
                <div
                        class="transition ease-in-out duration-200 group flex flex-wrap items-center justify-center w-14 h-14"
                >
                    <a href={contributionInfo.url} target="_blank">
                        <img
                                class="transition ease-in-out duration-200 rounded-full ring-2 group-hover:ring-feLightBlue-400"
                                src={contributionInfo.image}
                                alt={username}
                        />
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>