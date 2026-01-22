import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import jsonc from "eslint-plugin-jsonc";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import * as regexp from "eslint-plugin-regexp";
import yml from "eslint-plugin-yml";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
	{
		ignores: [
			"**/*.snap",
			"coverage",
			"lib",
			"node_modules",
			"packages/*/lib",
			"packages/*/tsconfig.tsbuildinfo",
			"packages/*/src/**/*.d.ts",
			"packages/*/src/**/*.js",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
		],
	},
	{ linterOptions: { reportUnusedDisableDirectives: "error" } },
	{
		extends: [
			js.configs.recommended,
			comments.recommended,
			jsdoc.configs["flat/contents-typescript-error"],
			jsdoc.configs["flat/logical-typescript-error"],
			jsdoc.configs["flat/stylistic-typescript-error"],
			...tseslint.configs.strict,
			...tseslint.configs.stylistic,
			perfectionist.configs["recommended-natural"],
			regexp.configs["flat/recommended"],
		],
		files: ["**/*.js", "**/*.ts"],
		rules: {
			// These off-by-default rules work well for this repo and we like them on.
			"jsdoc/informative-docs": "error",

			// Stylistic concerns that don't interfere with Prettier
			"logical-assignment-operators": [
				"error",
				"always",
				{ enforceForIfStatements: true },
			],
			"no-useless-rename": "error",
			"object-shorthand": "error",
			"operator-assignment": "error",
		},
		settings: { perfectionist: { partitionByComment: true, type: "natural" } },
	},
	{
		extends: [
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		files: ["**/*.js", "**/*.ts"],
		ignores: ["**/*.md/*", "packages/*/bin/*.js", "packages/*/*.config.*"],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			// These on-by-default rules work well for this repo if configured
			"@typescript-eslint/no-unnecessary-condition": [
				"error",
				{
					allowConstantLoopConditions: "only-allowed-literals",
				},
			],
		},
	},
	{
		extends: jsonc.configs["flat/recommended-with-json"],
		files: ["**/*.json"],
	},
	{
		extends: [packageJson.configs.recommended],
		files: ["**/package.json"],
	},
	{
		extends: [markdown.configs.recommended],
		files: ["**/*.md"],
		language: "markdown/gfm",
	},
	{
		extends: [vitest.configs.recommended],
		files: ["**/*.test.*"],
		settings: { vitest: { typecheck: true } },
	},
	{
		extends: [yml.configs["flat/recommended"], yml.configs["flat/prettier"]],
		files: ["**/*.{yml,yaml}"],
		rules: {
			"yml/file-extension": ["error", { extension: "yml" }],
			"yml/sort-keys": [
				"error",
				{
					order: { type: "asc" },
					pathPattern: "^.*$",
				},
			],
			"yml/sort-sequence-values": [
				"error",
				{
					order: { type: "asc" },
					pathPattern: "^.*$",
				},
			],
		},
	},
);
