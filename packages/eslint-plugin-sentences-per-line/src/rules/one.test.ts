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
	],
});
