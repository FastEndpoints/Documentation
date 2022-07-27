<script lang="ts">
	let features = [
		'Define endpoints in multiple class files (even in deeply nested folders)',
		'Auto discovery & registration of endpoints',
		'Attribute-free endpoint definitions (no attribute argument type restrictions)',
		'Secure by default & supports most auth providers',
		'Built-in support for JWT Bearer auth scheme',
		'Supports policy/permission/role/claim based security',
		'Declarative security policy building (in each endpoint)',
		'Supports any IOC container compatible with asp.net',
		'Constructor & property injection of endpoint dependencies',
		'Easy model binding from route/query/json body/claims/forms/headers',
		'Json source generator support for request/response dtos',
		'Easy file handling (multipart/form-data)',
		'Model validation with FluentValidation rules',
		'Convenient business logic validation & error responses',
		'Easy access to environment & configuration settings',
		'API versioning',
		'Rate limiting',
		'Response caching',
		'In-process pub/sub event notifications (with auto discovery)',
		'Easy Server-Sent-Events real-time data streaming',
		'Convenient integration testing (route-less & strongly-typed)',
		'Built-in uncaught exception handler',
		'Supports swagger/serilog/etc.',
		'Visual studio extension (vsix) for easy vertical slice feature scaffolding',
		'Plays well with the asp.net middleware pipeline',
		'Plus anything else the Minimal APIs can do...'
	];
</script>

<div class="feature-list">
	<div class="grid grid-rows-auto grid-cols-1 768:grid-cols-2 gap-4">
		{#each features as feature}
			<div
				class="transition ease-in-out rounded-lg bg-feDarkBlue-600 border-2 border-transparent hover:bg-feDarkBlue-800 hover:border-sky-500 p-4 leading-relaxed text-base"
			>
				{feature}
			</div>
		{/each}
	</div>
</div>
