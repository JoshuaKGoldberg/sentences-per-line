<h1 align="center">markdownlint-sentences-per-line</h1>

<p align="center">
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
    <a href="http://npmjs.com/package/markdownlint-sentences-per-line" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/markdownlint-sentences-per-line?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
    <img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

<p align="center">Markdownlint rule for limiting sentences per line. 📐</p>

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

`markdownlint-sentences-per-line` allows you to enforce that no line in your Markdown files contains more than one sentence.
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
npm i -D markdownlint-sentences-per-line
```

Then provide it to [markdownlint-cli's `--rules`](https://github.com/igorshubovych/markdownlint-cli#usage):

```shell
markdownlint --rules markdownlint-sentences-per-line
```

### Options

#### `additional_abbreviations`

An array of custom abbreviations to ignore when determining sentence boundaries.

These will be added to the standard list of abbreviations below.

`["eg.", "e.g.", "etc.", "ex.", "ie.", "i.e.", "vs."]`

Provide them under the rule's name in your [markdownlint configuration](https://github.com/DavidAnson/markdownlint/blob/main/README.md#optionsconfig):

```json
{
	"markdownlint-sentences-per-line": {
		"additional_abbreviations": ["Mme."]
	}
}
```

#### `locale`

The [BCP 47 locale tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument) describing the language your Markdown is written in.

Defaults to `"en-US"`.

```json
{
	"markdownlint-sentences-per-line": {
		"locale": "el"
	}
}
```

## Alternatives

This package is part of the [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) family of packages.
You might also consider:

- [`eslint-plugin-sentences-per-line`](../eslint-plugin-sentences-per-line): [ESLint](https://eslint.org/) plugin to enforce sentences per line in Markdown files.
- [`prettier-plugin-sentences-per-line`](../prettier-plugin-sentences-per-line): [Prettier](https://prettier.io) plugin to enforce sentences per line in Markdown files.
