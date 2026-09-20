import { one } from "./one.ts";
import { ruleTester } from "./ruleTester.ts";

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
			output: "Abc. \nDef.",
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
			output: "Hello! \nWorld.",
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
			output: "Hello? \nWorld.",
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
			output: "Really?! \nWow.",
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
			output: "Hello! \nWorld! Again.",
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
			output: "1. Hello! \nWorld.",
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
			output: "Bonjour Mme. \nDupont.",
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
			output: "Bonjour Mme. \nDupont.",
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
	],
});
