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
	const lowerCaseInput = input.toLowerCase();

	return allIgnoredWords.some((word) => {
		if (!lowerCaseInput.endsWith(word.toLowerCase())) {
			return false;
		}

		// The word must not be the tail end of a longer word, e.g. "index." is not "ex."
		const previousCharacter = input.at(-word.length - 1);

		return (
			previousCharacter === undefined ||
			!/[\p{L}\p{N}]/u.test(previousCharacter)
		);
	});
};
