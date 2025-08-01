/** @format */

// @ts-check
import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

export default tseslint.config({
	files: ["**/*.ts", "**/*.tsx"],

	extends: [
		eslintJs.configs.recommended,
		tseslint.configs.recommendedTypeChecked,
		eslintReact.configs["recommended-typescript"],
		expoConfig,
		reactYouMightNotNeedAnEffect.configs.recommended,
	],

	plugins: {},

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

	rules: {},
});
