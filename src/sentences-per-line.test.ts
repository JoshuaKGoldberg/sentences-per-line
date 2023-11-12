import markdownlint from "markdownlint";
import { describe, expect, test } from "vitest";

import { sentencesPerLine } from "./sentences-per-line.js";

describe("sentences-per-line", () => {
	test.each([
		["", undefined],
		["abc", undefined],
		["abc.", undefined],
		["Abc. Def.", "Abc. Def."],
		["Abc def. Ghi jkl.", "Abc def. Ghi j"],
		["`Abc. Def.`", undefined],
		["`Abc.` Def.", undefined],
		["`Abc.` `Def.`", undefined],
		["``Abc.`` Def.", undefined],
		["`Abc.` Def. Ghi", "c.` Def. Gh"],
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
			6,
		],
	])("%s", (input, errorContext, lineNumber = 1) => {
		const actual = markdownlint.sync({
			config: {
				default: false,
				"sentences-per-line": true,
			},
			customRules: [sentencesPerLine],
			strings: { input },
		});

		expect(actual).toEqual({
			input: errorContext
				? [
						{
							errorContext,
							errorDetail: null,
							errorRange: null,
							fixInfo: null,
							lineNumber,
							ruleDescription: "Each sentence should be on its own line",
							ruleInformation: null,
							ruleNames: ["sentences-per-line"],
						},
				  ]
				: [],
		});
	});
});
