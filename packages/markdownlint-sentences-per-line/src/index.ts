import type * as markdownlint from "markdownlint";

import helpers from "markdownlint-rule-helpers";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

const visitLine = (
	line: string,
	lineNumber: number,
	onError: markdownlint.RuleOnError,
) => {
	const start = getIndexBeforeSecondSentence(line);
	if (start) {
		helpers.addError(
			onError,
			lineNumber,
			undefined,
			line.slice(Math.max(0, start - 8), 14),
			undefined,
			{
				deleteCount: 1,
				editColumn: start + 1,
				insertText: "\n",
				lineNumber,
			},
		);
	}
};

export const markdownlintSentencesPerLine = {
	description: "Each sentence should be on its own line",
	function: (
		params: markdownlint.RuleParams,
		onError: markdownlint.RuleOnError,
	) => {
		let inFenceLine = false;

		for (let i = 0; i < params.lines.length; i += 1) {
			const line = params.lines[i];

			if (line.startsWith("```")) {
				inFenceLine = !inFenceLine;
				continue;
			}

			if (inFenceLine) {
				continue;
			}

			visitLine(line, i + 1, onError);
		}
	},
	names: ["markdownlint-sentences-per-line"],
	parser: "none",
	tags: ["sentences"],
} satisfies markdownlint.Rule;
