export {
	doesEndWithIgnoredWord,
	ignoredWords,
} from "./doesEndWithIgnoredWord.ts";
export { getIndexBeforeSecondSentence } from "./getIndexBeforeSecondSentence.ts";

export default (): never => {
	throw new Error(
		"The Markdownlint sentences-per-line plugin is now in the dedicated markdownlint-sentences-per-line package.",
	);
};
