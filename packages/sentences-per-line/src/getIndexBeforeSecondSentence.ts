import { doesEndWithIgnoredWord } from "./doesEndWithIgnoredWord.ts";

/**
 * @returns The first index after the period of the line's first sentence,
 * if a second sentence follows it.
 */
export function getIndexBeforeSecondSentence(line: string) {
	let i: number | undefined = 0;

	// Ignore headings
	if (/^\s*#/.test(line)) {
		return undefined;
	}

	// Skip any starting list number, e.g. "1. " or " 1. "
	if (/^\s*\d+\./.test(line)) {
		i = line.indexOf(".") + 1;
	}

	for (; i < line.length - 2; i += 1) {
		i = getNextIndexNotInCode(line, i);
		if (i === undefined || i >= line.length - 2) {
			return undefined;
		}

		if (
			line[i] === "." &&
			line[i + 1] === " " &&
			isCapitalizedAlphabetCharacter(line[i + 2]) &&
			!doesEndWithIgnoredWord(line.substring(0, i + 1))
		) {
			return i + 1;
		}
	}
}

function getNextIndexNotInCode(line: string, i: number) {
	if (line[i] !== "`") {
		return i;
	}

	i += 1;

	// Get to the inside of this inline code segment
	while (line[i] === "`") {
		i += 1;

		if (i === line.length) {
			return undefined;
		}
	}

	// Get to the end of the inline code segment
	while (true) {
		i = line.indexOf("`", i);

		if (i === -1) {
			return undefined;
		}

		if (line[i - 1] !== "\\") {
			break;
		}
	}

	while (line[i] === "`") {
		i += 1;

		if (i === line.length) {
			return undefined;
		}
	}

	return i;
}

function isCapitalizedAlphabetCharacter(char: string) {
	const charCode = char.charCodeAt(0);

	return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
}
