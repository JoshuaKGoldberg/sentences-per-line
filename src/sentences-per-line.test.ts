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
	])("%s", (input, errorContext) => {
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
							lineNumber: 1,
							ruleDescription: "Each sentence should be on its own line",
							ruleInformation: null,
							ruleNames: ["sentences-per-line"],
						},
				  ]
				: [],
		});
	});
});
