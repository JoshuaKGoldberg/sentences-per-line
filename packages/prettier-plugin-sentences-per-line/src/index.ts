import type { RootContent } from "mdast";
import type {
	AstPath,
	Options,
	Printer,
	StringArraySupportOption,
} from "prettier";

import * as markdown from "prettier/plugins/markdown";

import { modifyNodeIfMultipleSentencesInLine } from "./modifications/modifyNodeIfMultipleSentencesInLine.js";

const defaultKnownAbbreviations = [
	"eg.",
	"e.g.",
	"etc.",
	"ex.",
	"ie.",
	"i.e.",
	"vs.",
];

function createKnownAbbreviations(options: Options): string[] {
	const optionValue = options.knownAbbreviations;
	if (Array.isArray(optionValue)) {
		let customKnownAbbreviations = optionValue as string[];
		if (optionValue.includes("DEFAULT")) {
			customKnownAbbreviations = customKnownAbbreviations.filter(
				(v) => v !== "DEFAULT",
			);
			customKnownAbbreviations = [
				...customKnownAbbreviations,
				...defaultKnownAbbreviations,
			];
		}
		return customKnownAbbreviations;
	}
	return defaultKnownAbbreviations;
}

export const options = {
	knownAbbreviations: {
		array: true,
		category: "Global",
		default: [{ value: defaultKnownAbbreviations }],
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
		print(path: AstPath<RootContent>, options, print, args) {
			modifyNodeIfMultipleSentencesInLine(path, {
				knownAbbreviations: createKnownAbbreviations(options),
			});
			return mdastPrinter.print(path, options, print, args);
		},
	},
} satisfies Record<string, Printer<RootContent>>;
