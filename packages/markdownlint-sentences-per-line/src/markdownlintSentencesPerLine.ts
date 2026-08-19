import type * as markdownlint from "markdownlint";

import helpers from "markdownlint-rule-helpers";
import {
	getIndexBeforeSecondSentence,
	isSentenceContinuedOnNextLine,
} from "sentences-per-line";

const getSingleLineSentencesLimit = (config: unknown) => {
	if (
		typeof config !== "object" ||
		config === null ||
		!("singleLineSentences" in config)
	) {
		return undefined;
	}

	const { singleLineSentences } = config;

	if (singleLineSentences === true) {
		return Infinity;
	}

	return typeof singleLineSentences === "number"
		? singleLineSentences
		: undefined;
};

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

const visitLineStartingSentence = (
	lines: readonly string[],
	index: number,
	onError: markdownlint.RuleOnError,
	limit: number,
) => {
	const isContinued = (candidate: number) =>
		isSentenceContinuedOnNextLine(lines[candidate], lines[candidate + 1]);

	if (!isContinued(index) || (index > 0 && isContinued(index - 1))) {
		return;
	}

	let end = index;

	while (isContinued(end)) {
		end += 1;
	}

	const sentence = lines
		.slice(index, end + 1)
		.map((line) => line.trim())
		.join(" ");

	if (sentence.length <= limit) {
		helpers.addError(
			onError,
			index + 1,
			"Sentence continues on the next line",
			lines[index].trim().slice(-10),
		);
	}
};

export const markdownlintSentencesPerLine = {
	description: "Each sentence should be on its own line",
	function: (
		params: markdownlint.RuleParams,
		onError: markdownlint.RuleOnError,
	) => {
		const singleLineSentencesLimit = getSingleLineSentencesLimit(params.config);
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

			if (singleLineSentencesLimit !== undefined) {
				visitLineStartingSentence(
					params.lines,
					i,
					onError,
					singleLineSentencesLimit,
				);
			}
		}
	},
	names: ["markdownlint-sentences-per-line"],
	parser: "none",
	tags: ["sentences"],
} satisfies markdownlint.Rule;
