/** List of words to ignore when determining sentence boundaries */
export const ignoredWords = [
	"eg.",
	"e.g.",
	"etc.",
	"ex.",
	"ie.",
	"i.e.",
	"vs.",
];

/**
 * Given a lint of text, determine if it ends with an ignored word.
 */
export const doesEndWithIgnoredWord = (
	input: string,
	customIgnoredWords: string[] = [],
): boolean => {
	const allIgnoredWords = [...ignoredWords, ...customIgnoredWords];
	return allIgnoredWords.some((word) =>
		input.toLowerCase().endsWith(word.toLowerCase()),
	);
};
