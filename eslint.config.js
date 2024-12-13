const comments = require("@eslint-community/eslint-plugin-eslint-comments/configs");
const eslint = require("@eslint/js");
const vitest = require("@vitest/eslint-plugin");
const jsdoc = require("eslint-plugin-jsdoc");
const jsonc = require("eslint-plugin-jsonc");
const markdown = require("eslint-plugin-markdown");
const n = require("eslint-plugin-n");
const {
	default: packageJson,
} = require("eslint-plugin-package-json/configs/recommended");
const perfectionist = require("eslint-plugin-perfectionist");
const regexp = require("eslint-plugin-regexp");
const yml = require("eslint-plugin-yml");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
	{
		ignores: ["**/*.snap", "coverage", "lib", "node_modules", "pnpm-lock.yaml"],
	},
	{ linterOptions: { reportUnusedDisableDirectives: "error" } },
	eslint.configs.recommended,
	comments.recommended,
	jsdoc.configs["flat/contents-typescript-error"],
	jsdoc.configs["flat/logical-typescript-error"],
	jsdoc.configs["flat/stylistic-typescript-error"],
	jsonc.configs["flat/recommended-with-json"],
	markdown.configs.recommended,
	n.configs["flat/recommended"],
	packageJson,
	perfectionist.configs["recommended-natural"],
	regexp.configs["flat/recommended"],
	{
		extends: [
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,
		],
		files: ["**/*.js", "**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: { allowDefaultProject: ["*.config.*s"] },
				tsconfigRootDir: __dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-unnecessary-condition": [
				"error",
				{ allowConstantLoopConditions: true },
			],

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
		extends: [tseslint.configs.disableTypeChecked],
		files: ["**/*.js"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},
	{
		extends: [tseslint.configs.disableTypeChecked],
		files: ["**/*.md/*.ts"],
		rules: {
			"n/no-missing-import": [
				"error",
				{ allowModules: ["cspell-populate-words"] },
			],
		},
	},
	{
		extends: [vitest.configs.recommended],
		files: ["**/*.test.*"],
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "off",
		},
	},
	{
		extends: [yml.configs["flat/recommended"], yml.configs["flat/prettier"]],
		files: ["**/*.{yml,yaml}"],
		rules: {
			"yml/file-extension": ["error", { extension: "yml" }],
			"yml/sort-keys": [
				"error",
				{ order: { type: "asc" }, pathPattern: "^.*$" },
			],
			"yml/sort-sequence-values": [
				"error",
				{ order: { type: "asc" }, pathPattern: "^.*$" },
			],
		},
	},
);
