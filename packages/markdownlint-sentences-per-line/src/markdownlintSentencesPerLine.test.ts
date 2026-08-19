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
