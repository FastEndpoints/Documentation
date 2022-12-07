<div
	class="cursor-pointer w-full items-center rounded-sm border border-gray-divider bg-gray-elevate py-2.5 px-3 text-[15px] shadow-sm flex gap-x-2"
	on:click
>
	<div class="flex-1 flex items-center">
		<svg width="20" height="20" class="search-icon" viewBox="0 0 20 20">
			<path
				d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
				stroke="currentColor"
				fill="none"
				fill-rule="evenodd"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span>Search</span>
	</div>

	<span class="flex space-x-0.5 font-semibold">
		<span>⌘</span>
		<span>K</span>
	</span>
</div>

<style>
	.search-icon {
		margin-top: -0.25rem;
		margin-right: 0.5rem;
		stroke-width: 1.6;
	}
</style>
