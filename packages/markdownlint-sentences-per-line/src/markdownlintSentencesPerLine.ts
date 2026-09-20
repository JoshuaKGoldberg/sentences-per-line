import type * as markdownlint from "markdownlint";

import helpers from "markdownlint-rule-helpers";
import {
	getIndexBeforeSecondSentence,
	isSentenceContinuedOnNextLine,
} from "sentences-per-line";

/** Block-level tokens whose lines can't contain prose sentences */
const skippedTokenTypes = new Set<string>([
	"codeFenced",
	"codeIndented",
	"htmlFlow",
	"mathFlow",
	"table",
]);

const getSkippedLineNumbers = (
	tokens: markdownlint.MicromarkToken[],
	skipped = new Set<number>(),
) => {
	for (const token of tokens) {
		if (skippedTokenTypes.has(token.type)) {
			for (let line = token.startLine; line <= token.endLine; line += 1) {
				skipped.add(line);
			}
		} else {
			getSkippedLineNumbers(token.children, skipped);
		}
	}

	return skipped;
};

const getSingleLineSentencesLimit = (config: unknown) => {
	if (
		typeof config !== "object" ||
		config === null ||
		!("single_line_sentences" in config)
	) {
		return undefined;
	}

	const { single_line_sentences: singleLineSentences } = config;

	if (singleLineSentences === true) {
		return Infinity;
	}

	return typeof singleLineSentences === "number"
		? singleLineSentences
		: undefined;
};

const getAdditionalAbbreviations = (config: unknown): string[] => {
	if (
		typeof config !== "object" ||
		config === null ||
		!("additional_abbreviations" in config)
	) {
		return [];
	}

	const { additional_abbreviations: additionalAbbreviations } = config;

	return Array.isArray(additionalAbbreviations)
		? additionalAbbreviations.filter(
				(abbreviation): abbreviation is string =>
					typeof abbreviation === "string",
			)
		: [];
};

const getLocale = (config: unknown): string | undefined => {
	if (typeof config !== "object" || config === null || !("locale" in config)) {
		return undefined;
	}

	const { locale } = config;

	return typeof locale === "string" ? locale : undefined;
};

const visitLine = (
	line: string,
	lineNumber: number,
	onError: markdownlint.RuleOnError,
	additionalAbbreviations: string[],
	locale: string | undefined,
) => {
	const start = getIndexBeforeSecondSentence(
		line,
		additionalAbbreviations,
		locale,
	);
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
	additionalAbbreviations: string[],
	skippedLineNumbers: Set<number>,
) => {
	const isContinued = (candidate: number) =>
		!skippedLineNumbers.has(candidate + 1) &&
		!skippedLineNumbers.has(candidate + 2) &&
		isSentenceContinuedOnNextLine(
			lines[candidate],
			lines[candidate + 1],
			additionalAbbreviations,
		);

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
		const additionalAbbreviations = getAdditionalAbbreviations(params.config);
		const locale = getLocale(params.config);
		const singleLineSentencesLimit = getSingleLineSentencesLimit(params.config);
		const skippedLineNumbers = getSkippedLineNumbers(
			params.parsers.micromark.tokens,
		);

		for (let i = 0; i < params.lines.length; i += 1) {
			if (skippedLineNumbers.has(i + 1)) {
				continue;
			}

			visitLine(
				params.lines[i],
				i + 1,
				onError,
				additionalAbbreviations,
				locale,
			);

			if (singleLineSentencesLimit !== undefined) {
				visitLineStartingSentence(
					params.lines,
					i,
					onError,
					singleLineSentencesLimit,
					additionalAbbreviations,
					skippedLineNumbers,
				);
			}
		}
	},
	names: ["markdownlint-sentences-per-line"],
	parser: "micromark",
	tags: ["sentences"],
} satisfies markdownlint.Rule;
