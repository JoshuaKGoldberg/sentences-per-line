import * as markdownlint from "markdownlint/sync";
import { describe, expect, test } from "vitest";

import { markdownlintSentencesPerLine } from "./markdownlintSentencesPerLine.ts";

describe("markdownlint-sentences-per-line", () => {
	test.each([
		["", undefined],
		["abc", undefined],
		["abc.", undefined],
		[
			"Abc. Def.",
			"Abc. Def.",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 5,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"Abc def. Ghi jkl.",
			"Abc def. Ghi j",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 9,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["`Abc. Def.`", undefined],
		["`Abc.` Def.", undefined],
		["`Abc.` `Def.`", undefined],
		["``Abc.`` Def.", undefined],
		[
			"`Abc.` Def. Ghi",
			"c.` Def. Gh",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 12,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["```js```.", undefined],
		[
			"Hello! World",
			"Hello! World",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 7,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		[
			"Hello? World",
			"Hello? World",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 7,
					insertText: "\n",
					lineNumber: 1,
				},
				lineNumber: 1,
			},
		],
		["Hello! world", undefined],
		["Hello? world", undefined],
		["`Hello!` World.", undefined],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc.
Def.
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc. Def.
`,
			"Abc. Def.",
			{
				fixInfo: {
					deleteCount: 1,
					editColumn: 5,
					insertText: "\n",
					lineNumber: 6,
				},
				lineNumber: 6,
			},
		],
	] as const)("%s", (input, errorContext, report?) => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": true,
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input },
		});

		expect(actual).toEqual({
			input: errorContext
				? [
						{
							errorContext,
							errorDetail: null,
							errorRange: null,
							ruleDescription: "Each sentence should be on its own line",
							ruleInformation: null,
							ruleNames: ["markdownlint-sentences-per-line"],
							severity: "error",
							...report,
						},
					]
				: [],
		});
	});

	test("reports an error when given a French abbreviation that is not configured", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": true,
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Bonjour Mme. Dupont." },
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "our Mme. D",
					errorDetail: null,
					errorRange: null,
					fixInfo: {
						deleteCount: 1,
						editColumn: 13,
						insertText: "\n",
						lineNumber: 1,
					},
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test("reports no errors when given a French abbreviation in additional_abbreviations", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": {
					additional_abbreviations: ["Mme."],
				},
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Bonjour Mme. Dupont." },
		});

		expect(actual).toEqual({ input: [] });
	});

	test("reports an error when additional_abbreviations is not an array", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": {
					additional_abbreviations: "Mme.",
				},
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Bonjour Mme. Dupont." },
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "our Mme. D",
					errorDetail: null,
					errorRange: null,
					fixInfo: {
						deleteCount: 1,
						editColumn: 13,
						insertText: "\n",
						lineNumber: 1,
					},
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test("reports no errors when additional_abbreviations also contains a non-string entry", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": {
					additional_abbreviations: [123, "Mme."],
				},
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Bonjour Mme. Dupont." },
		});

		expect(actual).toEqual({ input: [] });
	});

	test("reports no errors when a sentence spans multiple lines and single_line_sentences is not enabled", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": true,
			},
			customRules: [markdownlintSentencesPerLine],
			strings: {
				input: "This is a single sentence that spans\nmultiple lines.",
			},
		});

		expect(actual).toEqual({ input: [] });
	});

	test("reports an error when a sentence spans two lines and single_line_sentences is true", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { single_line_sentences: true },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: {
				input: "This is a single sentence that spans\nmultiple lines.",
			},
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "that spans",
					errorDetail: "Sentence continues on the next line",
					errorRange: null,
					fixInfo: null,
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test("reports one error when a sentence spans three lines and single_line_sentences is true", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { single_line_sentences: true },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "One\ntwo\nthree." },
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "One",
					errorDetail: "Sentence continues on the next line",
					errorRange: null,
					fixInfo: null,
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test("reports no errors when a spanning sentence is longer than single_line_sentences", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { single_line_sentences: 40 },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: {
				input: "This is a single sentence that spans\nmultiple lines.",
			},
		});

		expect(actual).toEqual({ input: [] });
	});

	test("reports an error when a spanning sentence is no longer than single_line_sentences", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { single_line_sentences: 80 },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: {
				input: "This is a single sentence that spans\nmultiple lines.",
			},
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "that spans",
					errorDetail: "Sentence continues on the next line",
					errorRange: null,
					fixInfo: null,
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test.each([
		["a tilde fence", "~~~js\nconst x = 1\nconst y = 2\n~~~"],
		[
			"a fence inside a list item",
			"- Item:\n\n  ```js\n  const x = 1\n  const y = 2\n  ```",
		],
		["a fence inside a fence", "````md\n```\nfoo\nbar\n```\n````"],
		["indented code", "Para.\n\n    const x = 1\n    const y = 2"],
		[
			"an HTML block",
			'<p align="center">\n  Some centered text\n  more text\n</p>',
		],
		["a table without leading pipes", "Foo | Bar\n--- | ---\na | b\nc | d"],
		["a math block", "$$\nx = 1\ny = 2\n$$"],
	])(
		"reports no errors when given %s and single_line_sentences is true",
		(_, input) => {
			const actual = markdownlint.lint({
				config: {
					default: false,
					"markdownlint-sentences-per-line": { single_line_sentences: true },
				},
				customRules: [markdownlintSentencesPerLine],
				strings: { input },
			});

			expect(actual).toEqual({ input: [] });
		},
	);

	test("reports an error for each of two consecutive spanning sentences", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { single_line_sentences: true },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "One\ntwo.\nThree\nfour." },
		});

		expect(actual.input.map((error) => error.lineNumber)).toEqual([1, 3]);
	});

	test.each([
		[6, 1],
		[5, 0],
	])(
		"reports errors for a spanning sentence of length 6 when single_line_sentences is %i",
		(limit, count) => {
			const actual = markdownlint.lint({
				config: {
					default: false,
					"markdownlint-sentences-per-line": { single_line_sentences: limit },
				},
				customRules: [markdownlintSentencesPerLine],
				strings: { input: "ab\ncd." },
			});

			expect(actual.input).toHaveLength(count);
		},
	);

	test("reports an error when a sentence spans lines after an abbreviation in additional_abbreviations", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": {
					additional_abbreviations: ["Mme."],
					single_line_sentences: true,
				},
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Bonjour Mme.\nDupont." },
		});

		expect(actual.input.map((error) => error.lineNumber)).toEqual([1]);
	});

	test("reports an error when given a locale that treats the character as a terminator", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { locale: "el" },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Foo; Bar baz" },
		});

		expect(actual).toEqual({
			input: [
				{
					errorContext: "Foo; Bar baz",
					errorDetail: null,
					errorRange: null,
					fixInfo: {
						deleteCount: 1,
						editColumn: 5,
						insertText: "\n",
						lineNumber: 1,
					},
					lineNumber: 1,
					ruleDescription: "Each sentence should be on its own line",
					ruleInformation: null,
					ruleNames: ["markdownlint-sentences-per-line"],
					severity: "error",
				},
			],
		});
	});

	test("reports no errors when given a list item with two spaces after its marker", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": true,
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "1.  Foo" },
		});

		expect(actual).toEqual({ input: [] });
	});

	test("reports no errors when locale is not a string", () => {
		const actual = markdownlint.lint({
			config: {
				default: false,
				"markdownlint-sentences-per-line": { locale: 123 },
			},
			customRules: [markdownlintSentencesPerLine],
			strings: { input: "Foo; Bar baz" },
		});

		expect(actual).toEqual({ input: [] });
	});
});
