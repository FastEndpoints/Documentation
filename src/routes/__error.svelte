<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ error, status }) => {
		return {
			props: {
				code: status,
				title: `${status}: ${error!.message}`
			}
		};
	};
</script>

<script lang="ts">
	import '@svelteness/kit-docs/client/polyfills/index.js';
	import '@svelteness/kit-docs/client/styles/fonts.css';

	import '../app.css';
	import '../vars.css';

	export let title: string;
	export let code: number;
</script>

<main class="h-screen w-full flex flex-col justify-center items-center bg-[#090e18]">
	<h1 class="text-9xl font-extrabold text-white tracking-widest">{code}</h1>
	<div class="bg-feLightBlue-700 px-2 text-sm rounded rotate-12 absolute">{title}</div>
	<button class="mt-5">
		<a
			href="/"
			class="relative inline-block text-sm font-medium text-feLightBlue-300 group active:text-feLightBlue-500 focus:outline-none focus:ring"
		>
			<a
				href="/"
				class="text-gray-200 bg-gradient-to-tr from-feLightBlue-600 to-feBlue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-feLightBlue-300 dark:focus:ring-feLightBlue-600 font-medium rounded-md text-sm px-5 shadow-md shadow-feBlue-500/20 hover:shadow-lg hover:shadow-feBlue-700/40 py-2.5 text-center uppercase mr-2 mb-2 active:opacity-[0.85]"
				>Go Home</a
			>
		</a>
	</button>
</main>
