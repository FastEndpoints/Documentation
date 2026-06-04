<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="site-main error-page">
	<section class="prose text-center mx-auto">
		<h1>{$page.status}</h1>
		<p>{$page.error?.message ?? 'Something went wrong.'}</p>
		<a class="text-gray-200 bg-gradient-to-tr from-feLightBlue-600 to-feBlue-600 font-medium rounded-md text-sm px-5 py-2.5 inline-block" href="/">Go home</a>
	</section>
</main>
