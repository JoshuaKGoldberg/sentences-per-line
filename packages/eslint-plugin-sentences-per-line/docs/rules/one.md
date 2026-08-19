# sentences-per-line/one

📝 Limits Markdown sentences to one per line.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces that each at most one sentence appears per line in Markdown files.
If two or more sentences appear on the same line, they will be split onto separate lines.

## Examples

Example of **incorrect** code for this rule:

<!-- prettier-ignore-start -->

```md
First sentence. Second sentence
```

<!-- prettier-ignore-end -->

Example of **correct** code for this rule:

```md
First sentence.
Second sentence
```

## Options

### `additionalAbbreviations`

An array of custom abbreviations to ignore when determining sentence boundaries.

These will be added to the standard list of abbreviations below.

`["eg.", "e.g.", "etc.", "ex.", "ie.", "i.e.", "vs."]`

```js
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
