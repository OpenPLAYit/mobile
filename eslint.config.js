/** @format */

// @ts-check
import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactQueryKeys from "eslint-plugin-react-query-keys";

export default tseslint.config({
	files: ["**/*.ts", "**/*.tsx"],

	// Extend recommended rule sets from:
	// 1. ESLint JS's recommended rules
	// 2. TypeScript ESLint recommended rules
	// 3. ESLint React's recommended-typescript rules
	extends: [
		eslintJs.configs.recommended,
		tseslint.configs.strictTypeChecked,
		eslintReact.configs["recommended-typescript"],
		expoConfig,
	],

	plugins: {
		"@tanstack/query": pluginQuery,
		"react-query-keys": reactQueryKeys,
	},

	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},

	settings: {
		react: {
			version: "detect",
		},
	},

	rules: {
		...pluginQuery.configs.recommended.rules,
		"react-query-keys/no-plain-query-keys": "warn",
		"no-restricted-imports": [
			"error",
			{
				paths: [
					{
						name: "zod/v3",
						message: `Please use 'zod' instead of the 'zod/v3' import.See https://github.com/colinhacks/zod/releases/tag/v4.0.1`,
					},
					{
						name: "zod/v4",
						message: `Please use 'zod' instead of the 'zod/v4' import.See https://github.com/colinhacks/zod/releases/tag/v4.0.1`,
					},
					{
						name: "zod/v4-mini",
						message: `Please use 'zod' instead of the 'zod/v4-mini' import. We do not intend to use the mini version.`,
					},
				],
			},
		],
	},
});
