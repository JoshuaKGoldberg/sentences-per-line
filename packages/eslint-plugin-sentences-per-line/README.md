<h1 align="center">eslint-plugin-sentences-per-line</h1>

<p align="center">
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
    <a href="http://npmjs.com/package/eslint-plugin-sentences-per-line" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/eslint-plugin-sentences-per-line?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
    <img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

<p align="center">ESLint plugin for limiting sentences per line. 📐</p>

`eslint-plugin-sentences-per-line` allows you to enforce that no line in your Markdown files contains more than one sentence.
This is useful because:

- Shorter lines result in simpler, easier-to-understand Git diffs
- Longer lines are harder to read in source code

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

## Usage

> 👉 This ESLint plugin assumes you're using [`@eslint/markdown`](https://www.npmjs.com/package/@eslint/markdown).

First install this package as a devDependency:

```shell
npm i -D eslint-plugin-sentences-per-line
```

Then add the following options to your [ESLint configuration file](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new):

```ts
import markdown from "@eslint/markdown";
import sentencesPerLine from "eslint-plugin-sentences-per-line";

export default [
	// your other ESLint configurations
	{
		extends: [
			markdown.configs.recommended,
			// 👇 Apply this config to your *.md files
			sentencesPerLine.configs.recommended,
		],
		files: ["**/*.md"],
	},
];
```

### Options

#### `additionalAbbreviations`

An array of custom abbreviations to ignore when determining sentence boundaries.

These will be added to the standard list of abbreviations below.

`["eg.", "e.g.", "etc.", "ex.", "ie.", "i.e.", "vs."]`

```ts
export default [
	{
		rules: {
			"sentences-per-line/one": [
				"error",
				{ additionalAbbreviations: ["Mme."] },
			],
		},
	},
];
```

#### `locale`

The [BCP 47 locale tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument) describing the language your Markdown is written in.

Defaults to `"en-US"`.

```ts
export default [
	{
		rules: {
			"sentences-per-line/one": ["error", { locale: "el" }],
		},
	},
];
```

## Rules

<!-- prettier-ignore-start -->
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                     | Description                                | 💼 | 🔧 |
| :----------------------- | :----------------------------------------- | :- | :- |
| [one](docs/rules/one.md) | Limits Markdown sentences to one per line. | ✅  | 🔧 |

<!-- end auto-generated rules list -->
<!-- prettier-ignore-end -->

## Alternatives

This package is part of the [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) family of packages.
You might also consider:

- [`markdownlint-sentences-per-line`](../markdownlint-sentences-per-line): [Markdownlint](https://github.com/DavidAnson/markdownlint) rule to enforce sentences per line in Markdown files.
- [`prettier-plugin-sentences-per-line`](../prettier-plugin-sentences-per-line): [Prettier](https://prettier.io) plugin to enforce sentences per line in Markdown files.
