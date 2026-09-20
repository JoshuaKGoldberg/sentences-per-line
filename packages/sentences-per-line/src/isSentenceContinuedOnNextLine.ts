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

const hardLineBreak = /(?: {2}|\\|<br\s*\/?>)\s*$/;

const sentenceEnding = /[.!?…][”’»"')\]*_`~]*(?:\[\^[^\]]+\])?$/;

const linkOrImage = /!?\[[^[\]]*\](?:\([^()]*\)|\[[^[\]]*\])?/g;

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
		hardLineBreak.test(line) ||
		isOnlyLinksOrImages(line)
	) {
		return false;
	}

	const trimmed = line.trimEnd();

	return (
		!sentenceEnding.test(trimmed) ||
		doesEndWithIgnoredWord(trimmed, customIgnoredWords)
	);
}

/**
 * Lines made up only of links and images, such as rows of badges, aren't prose.
 */
function isOnlyLinksOrImages(line: string) {
	let previous: string;
	let remaining = line;

	// Links may wrap images, so strip from the inside out until nothing changes
	do {
		previous = remaining;
		remaining = remaining.replace(linkOrImage, "");
	} while (remaining !== previous);

	return remaining !== line && /^[\s|]*$/.test(remaining);
}

function isParagraphLine(line: string) {
	return !Object.values(nonParagraphLines).some((pattern) =>
		pattern.test(line),
	);
}
