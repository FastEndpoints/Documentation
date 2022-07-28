<script lang="ts">
	let features = [
		{ order: 1, description: 'Define endpoints in multiple class files (even in deeply nested folders)' },
		{ order: 14, description: 'Auto discovery & registration of endpoints' },
		{ order: 2, description: 'Attribute-free endpoint definitions (no attribute argument type restrictions)' },
		{ order: 15, description: 'Secure by default & supports most auth providers' },
		{ order: 3, description: 'Built-in support for JWT Bearer auth scheme' },
		{ order: 16, description: 'Supports policy / permission / role / claim based security' },
		{ order: 4, description: 'Declarative security policy building (in each endpoint)' },
		{ order: 17, description: 'Supports any IOC container compatible with ASP.NET' },
		{ order: 5, description: 'Constructor & property injection of endpoint dependencies' },
		{ order: 18, description: 'Easy model binding from route / query / JSON / body /claims /forms / headers' },
		{ order: 6, description: 'JSON source generator support for request/response dtos' },
		{ order: 19, description: 'Easy file handling (multipart/form-data)' },
		{ order: 7, description: 'Model validation with FluentValidation rules' },
		{ order: 20, description: 'Convenient business logic validation & error responses' },
		{ order: 8, description: 'Easy access to environment & configuration settings' },
		{ order: 21, description: 'API versioning' },
		{ order: 9, description: 'Rate limiting' },
		{ order: 22, description: 'Response caching' },
		{ order: 10, description: 'In-process pub/sub event notifications (with auto discovery)' },
		{ order: 23, description: 'Easy Server-Sent-Events real-time data streaming' },
		{ order: 11, description: 'Convenient integration testing (route-less & strongly-typed)' },
		{ order: 24, description: 'Built-in uncaught exception handler' },
		{ order: 12, description: 'Supports Swagger/Serilog/etc.' },
		{ order: 25, description: 'Visual Studio extension (vsix) for easy vertical slice feature scaffolding' },
		{ order: 13, description: 'Plays well with the ASP.NET middleware pipeline' },
		{ order: 26, description: 'Plus anything else the Minimal APIs can do...'}
	];
</script>

<div class="feature-list">
	<div class="flex flex-col gap-2 mb-12">
		<div class="font-semibold text-feLightBlue-500 text-base">Rapid Development</div>
		<div class="font-bold text-3xl">Using These Handy Features</div>
	</div>
	<div class="grid grid-rows-auto grid-cols-1 768:grid-cols-2 grid-flow-dense gap-2">
		{#each features as feature, i}
			<div
				class="order-{feature.order} 768:order-none transition ease-in-out flex items-center rounded-lg bg-feDarkBlue-600 gap-4 border border-transparent p-2  leading-relaxed text-sm"
			>
				<span class="rounded-full min-w-[32px] min-h-[32px] bg-feDarkBlue-800 inline-flex items-center text-xs justify-center">
					{feature.order}
				</span>
				{feature.description}
			</div>
		{/each}
	</div>
</div>

<style global>
	.order-1 { order: 1; }
	.order-2 { order: 2; }
	.order-3 { order: 3; }
	.order-4 { order: 4; }
	.order-5 { order: 5; }
	.order-6 { order: 6; }
	.order-7 { order: 7; }
	.order-8 { order: 8; }
	.order-9 { order: 9; }
	.order-10 { order: 10; }
	.order-11 { order: 11; }
	.order-12 { order: 12; }
	.order-13 { order: 13; }
	.order-14 { order: 14; }
	.order-15 { order: 15; }
	.order-16 { order: 16; }
	.order-17 { order: 17; }
	.order-18 { order: 18; }
	.order-19 { order: 19; }
	.order-20 { order: 20; }
	.order-21 { order: 21; }
	.order-22 { order: 22; }
	.order-23 { order: 23; }
	.order-24 { order: 24; }
	.order-25 { order: 25; }
	.order-26 { order: 26; }
</style>