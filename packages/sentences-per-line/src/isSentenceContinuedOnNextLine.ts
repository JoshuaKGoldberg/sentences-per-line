import { doesEndWithIgnoredWord } from "./doesEndWithIgnoredWord.ts";

const nonParagraphLines = {
	blank: /^\s*$/,
	blockQuote: /^\s*>/,
	codeFence: /^\s*(?:```|~~~)/,
	heading: /^\s*#/,
	html: /^\s*</,
	indentedCode: /^(?: {4}|\t)/,
	linkDefinition: /^\s*\[[^\]]*\]:/,
	orderedList: /^\s*\d+[.)]\s/,
	tableRow: /^\s*\|/,
	thematicBreak: /^\s*[-*_=]{2,}\s*$/,
	unorderedList: /^\s*[-*+]\s/,
};

const hardLineBreak = /(?: {2}|\\)\s*$/;

const sentenceEnding = /[.!?]["')\]*_`]*$/;

/**
 * @returns Whether the line's last sentence is not finished by the end of the
 * line, and so continues onto the next line.
 */
export function isSentenceContinuedOnNextLine(
	line: string,
	nextLine: string | undefined,
	customIgnoredWords: string[] = [],
): boolean {
	if (
		nextLine === undefined ||
		!isParagraphLine(line) ||
		!isParagraphLine(nextLine) ||
		hardLineBreak.test(line)
	) {
		return false;
	}

	const trimmed = line.trimEnd();

	return (
		!sentenceEnding.test(trimmed) ||
		doesEndWithIgnoredWord(trimmed, customIgnoredWords)
	);
}

function isParagraphLine(line: string) {
	return !Object.values(nonParagraphLines).some((pattern) =>
		pattern.test(line),
	);
}
