import * as markdownlint from "markdownlint/sync";
import { describe, expect, test } from "vitest";

import { markdownlintSentencesPerLine } from "./markdownlintSentencesPerLine.js";

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
});
