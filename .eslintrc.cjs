module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['*.cjs', '.svelte-kit/**', 'docs/**', '.migration-baseline/**'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	}
};
