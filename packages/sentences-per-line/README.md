<h1 align="center">sentences-per-line</h1>

<p align="center">Utility functions to enforce the number of sentences per line in Markdown files. 📐</p>

<p align="center">
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
    <a href="https://github.com/JoshuaKGoldberg/sentences-per-line/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
    <a href="http://npmjs.com/package/sentences-per-line" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/sentences-per-line?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
    <img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

> Looking for the ESLint, Markdownlint, or Prettier plugins to enforce `sentences-per-line`?
> See [../../README.md > ## Packages](../../README.md#packages).

```shell
npm i sentences-per-line
```

### `getIndexBeforeSecondSentence`

Retrieves the first index after the period of the line's first sentence, if a second sentence follows it.
This is the driving function behind enforcing one sentence per line in the `sentences-per-line` monorepo's packages.

```ts
import { getIndexBeforeSecondSentence } from "sentences-per-line";

// undefined
getIndexBeforeSecondSentence("The only sentence.");

// 15
getIndexBeforeSecondSentence("First sentence. Second sentence.");
```
