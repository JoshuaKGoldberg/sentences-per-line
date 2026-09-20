import markdown from "@eslint/markdown";
import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { one } from "./one.ts";
import { ruleTester } from "./ruleTester.ts";

function fixRepeatedly(code: string) {
	return new Linter().verifyAndFix(
		code,
		[
			{
				files: ["**/*.md"],
				language: "markdown/commonmark",
				plugins: {
					markdown,
					"sentences-per-line": { rules: { one } },
				},
				rules: { "sentences-per-line/one": "error" },
			},
		],
		"file.md",
	).output;
}

ruleTester.run("one", one, {
	invalid: [
		{
			code: "Abc. Def.",
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Abc.\nDef.",
		},
		{
			code: `
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc. Def.
`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 6,
					line: 6,
					messageId: "multiple",
				},
			],
			output: `
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc.
Def.
`,
		},
		{
			code: "Hello! World.",
			errors: [
				{
					column: 7,
					endColumn: 8,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Hello!\nWorld.",
		},
		{
			code: "Hello? World.",
			errors: [
				{
					column: 7,
					endColumn: 8,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Hello?\nWorld.",
		},
		{
			code: "Really?! Wow.",
			errors: [
				{
					column: 9,
					endColumn: 10,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Really?!\nWow.",
		},
		{
			code: "Hello! World! Again.",
			errors: [
				{
					column: 7,
					endColumn: 8,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Hello!\nWorld! Again.",
		},
		{
			code: "1. Hello! World.",
			errors: [
				{
					column: 10,
					endColumn: 11,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "1. Hello!\nWorld.",
		},
		{
			code: "&amp; Abc. Def.",
			errors: [
				{
					column: 11,
					endColumn: 12,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "&amp; Abc.\nDef.",
		},
		{
			code: "Bonjour Mme. Dupont.",
			errors: [
				{
					column: 13,
					endColumn: 14,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: "Bonjour Mme.\nDupont.",
		},
		{
			code: "Bonjour Mme. Dupont.",
			errors: [
				{
					column: 13,
					endColumn: 14,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			options: [{ additionalAbbreviations: ["Mlle."] }],
			output: "Bonjour Mme.\nDupont.",
		},
		{
			code: "- Abc.\n  Def. Ghi.",
			errors: [
				{
					column: 7,
					endColumn: 8,
					endLine: 2,
					line: 2,
					messageId: "multiple",
				},
			],
			output: "- Abc.\n  Def.\nGhi.",
		},
		{
			code: 'He said "Hello." Then left.',
			errors: [
				{
					column: 17,
					endColumn: 18,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			output: 'He said "Hello."\nThen left.',
		},
		{
			code: "Foo; Bar baz",
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 1,
					line: 1,
					messageId: "multiple",
				},
			],
			options: [{ locale: "el" }],
			output: "Foo;\nBar baz",
		},
	],
	valid: [
		"",
		"abc",
		"abc.",
		"`Abc. Def.`",
		"`Abc.` Def.",
		"`Abc.` `Def.`",
		"``Abc.`` Def.",
		"```js```.",
		`
\`\`\`plaintext
Abc. Def.
\`\`\`
`,
		`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc.
Def.
`,
		"Hello! world.",
		"Hello? world.",
		"`Hello!` World.",
		"`Hello?` World.",
		"Hello!",
		"Hello?",
		{
			code: "Bonjour Mme. Dupont.",
			options: [{ additionalAbbreviations: ["Mme."] }],
		},
		"Foo; Bar baz",
	],
});

describe("one fixer", () => {
	it("splits every sentence onto its own line when fixing repeatedly", () => {
		const actual = fixRepeatedly("Foo. Bar. Baz. Foo2. Bar2.\n");

		expect(actual).toBe("Foo.\nBar.\nBaz.\nFoo2.\nBar2.\n");
	});

	it("splits every sentence onto its own line when the source already has a line ending in a space", () => {
		const actual = fixRepeatedly("Foo. \nBar. Baz. Foo2. Bar2.\n");

		expect(actual).toBe("Foo. \nBar.\nBaz.\nFoo2.\nBar2.\n");
	});
});
