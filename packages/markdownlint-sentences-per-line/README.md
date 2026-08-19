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

#### `singleLineSentences`

Whether to also report sentences that are split across multiple lines.

By default, only lines that contain more than one sentence are reported.
Enabling this option additionally requires each sentence to take up exactly one line: no more, no less.

```json
{
	"markdownlint-sentences-per-line": {
		"singleLineSentences": true
	}
}
```

That configuration reports the following Markdown:

```md
This is a single sentence that spans
multiple lines.
```

Providing a number instead of `true` allows sentences longer than that many characters to be split across lines.
This is useful for wrapping only the occasional long sentence.

```json
{
	"markdownlint-sentences-per-line": {
		"singleLineSentences": 80
	}
}
```

## Alternatives

This package is part of the [sentences-per-line](https://github.com/JoshuaKGoldberg/sentences-per-line) family of packages.
You might also consider:

- [`eslint-plugin-sentences-per-line`](../eslint-plugin-sentences-per-line): [ESLint](https://eslint.org/) plugin to enforce sentences per line in Markdown files.
- [`prettier-plugin-sentences-per-line`](../prettier-plugin-sentences-per-line): [Prettier](https://prettier.io) plugin to enforce sentences per line in Markdown files.
