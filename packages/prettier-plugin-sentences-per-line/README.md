<h1 align="center">prettier-plugin-sentences-per-line</h1>

<p align="center">
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
    <a href="http://npmjs.com/package/prettier-plugin-sentences-per-line" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/prettier-plugin-sentences-per-line?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
    <img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

<p align="center">Prettier plugin for limiting sentences per line. 📐</p>

prettier-plugin-sentences-per-line allows you to enforce that no line in your Markdown files contains more than one sentence.

This is useful because:

- Shorter lines result in simpler, easier-to-understand Git diffs
- Longer lines are harder to read in source code

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

## Usage

First install this package as a devDependency:

```shell
npm i -D prettier-plugin-sentences-per-line
```

Then add it to your [Prettier config's `plugins`](https://prettier.io/docs/plugins):

```json
{
	"plugins": ["prettier-plugin-sentences-per-line"]
}
```

### Options

#### `knownAbbreviations`

An array of custom abbreviations to ignore when determining sentence boundaries.

**Default:** `["eg.", "e.g.", "etc.", "ex.", "ie.", "i.e.", "vs."]`

```json
{
	"plugins": ["prettier-plugin-sentences-per-line"],
	"knownAbbreviations": ["I.M."]
}
```

If you want to simply extend the default values, rather than override them, you can include the `"DEFAULT"` token in the array.

```json
{
	"plugins": ["prettier-plugin-sentences-per-line"],
	"knownAbbreviations": ["DEFAULT", "I.M."]
}
```

## Alternatives

This package is part of the [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) family of packages.

You might also consider:

- [`eslint-plugin-sentences-per-line`](../eslint-plugin-sentences-per-line): [ESLint](https://eslint.org/) plugin to enforce sentences per line in Markdown files.
- [`markdownlint-sentences-per-line`](../markdownlint-sentences-per-line): [Markdownlint](https://github.com/DavidAnson/markdownlint) plugin to enforce sentences per line in Markdown files.
