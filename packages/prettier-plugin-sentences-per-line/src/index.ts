import type { RootContent } from "mdast";
import type { AstPath, Printer, StringArraySupportOption } from "prettier";

import * as markdown from "prettier/plugins/markdown";

import { modifyNodeIfMultipleSentencesInLine } from "./modifications/modifyNodeIfMultipleSentencesInLine.js";

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
				customAbbreviations: printOptions.additionalAbbreviations as string[],
			});
			return mdastPrinter.print(path, printOptions, print, args);
		},
	},
} satisfies Record<string, Printer<RootContent>>;
