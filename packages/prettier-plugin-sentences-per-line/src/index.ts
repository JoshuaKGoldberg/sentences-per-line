import type { RootContent } from "mdast";
import type {
	AstPath,
	Options,
	Printer,
	StringArraySupportOption,
} from "prettier";

import * as markdown from "prettier/plugins/markdown";

import { modifyNodeIfMultipleSentencesInLine } from "./modifications/modifyNodeIfMultipleSentencesInLine.js";

const standardAbbreviations = [
	"eg.",
	"e.g.",
	"etc.",
	"ex.",
	"ie.",
	"i.e.",
	"vs.",
];

function createKnownAbbreviations(options: Options): string[] {
	const optionValue = options.additionalAbbreviations;
	if (Array.isArray(optionValue)) {
		const additionalAbbreviations = optionValue as string[];
		return [...standardAbbreviations, ...additionalAbbreviations];
	}
	return standardAbbreviations;
}

export const options = {
	additionalAbbreviations: {
		array: true,
		category: "Global",
		default: [{ value: [] }],
		description:
			"An array of custom abbreviations to ignore when determining sentence boundaries.",
		type: "string",
	},
} satisfies Record<string, StringArraySupportOption>;

export const parsers = {
	...markdown.parsers,
};

// @ts-expect-error -- markdown does not provide public exports
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	mdast: {
		...mdastPrinter,
		print(path: AstPath<RootContent>, printOptions, print, args) {
			modifyNodeIfMultipleSentencesInLine(path, {
				knownAbbreviations: createKnownAbbreviations(printOptions),
			});
			return mdastPrinter.print(path, printOptions, print, args);
		},
	},
} satisfies Record<string, Printer<RootContent>>;
