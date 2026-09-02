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

Retrieves the first index after the period, question mark, or exclamation mark of the line's first sentence, if a second sentence follows it.
This is the driving function behind enforcing one sentence per line in the `sentences-per-line` monorepo's packages.

```ts
import { getIndexBeforeSecondSentence } from "sentences-per-line";

// undefined
getIndexBeforeSecondSentence("The only sentence.");

// 15
getIndexBeforeSecondSentence("First sentence. Second sentence.");
```

It optionally takes in an array of additional words to treat as abbreviations instead of sentence endings.

```ts
// undefined
getIndexBeforeSecondSentence("Bonjour Mme. Dupont.", ["Mme."]);
```

It also optionally takes in a [BCP 47 locale tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument) describing the language the Markdown is written in.
It defaults to `"en-US"`.

```ts
// 4
getIndexBeforeSecondSentence("Foo; Bar baz", [], "el");
```

Sentence boundaries are found with [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) in runtimes that provide it.
Runtimes without `Intl.Segmenter` fall back to looking for a period, question mark, or exclamation mark.
