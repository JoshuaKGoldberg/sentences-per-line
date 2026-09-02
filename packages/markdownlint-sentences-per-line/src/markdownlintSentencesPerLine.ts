import type * as markdownlint from "markdownlint";

import helpers from "markdownlint-rule-helpers";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

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

export const markdownlintSentencesPerLine = {
	description: "Each sentence should be on its own line",
	function: (
		params: markdownlint.RuleParams,
		onError: markdownlint.RuleOnError,
	) => {
		const additionalAbbreviations = getAdditionalAbbreviations(params.config);
		const locale = getLocale(params.config);
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

			visitLine(line, i + 1, onError, additionalAbbreviations, locale);
		}
	},
	names: ["markdownlint-sentences-per-line"],
	parser: "none",
	tags: ["sentences"],
} satisfies markdownlint.Rule;
