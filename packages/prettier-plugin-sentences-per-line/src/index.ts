import type { Nodes, RootContent } from "mdast";
import type { AstPath, Printer, StringArraySupportOption } from "prettier";

import { builders } from "prettier/doc";
import * as markdown from "prettier/plugins/markdown";

import { modifyNodeIfMultipleSentencesInLine } from "./modifications/modifyNodeIfMultipleSentencesInLine.ts";

export const options = {
	sentencesPerLineAdditionalAbbreviations: {
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

const { breakParent, group, line } = builders;

const print: Printer<Nodes>["print"] = (path, options, print, args) => {
	const node = path.node;

	// Run structural modification ONCE at the root
	if (node.type === "root") {
		const customAbbreviations =
			options.sentencesPerLineAdditionalAbbreviations as string[];
		modifyNodeIfMultipleSentencesInLine(path as AstPath<RootContent>, {
			customAbbreviations,
		});
	}

	/** print sentence (MUST be grouped to be used in conjunction with {@link breakParent}) */
	if (node.type === "sentence") {
		return group(
			// @ts-expect-error -- Prettier's AstPath.call typings cannot express that
			// `children` here is `Nodes[]`; TypeScript infers `string`
			path.map(print, "children"),
		);
	}

	if (node.type === "sentenceBreak") {
		return [breakParent, line];
	}

	// Fallback to Prettier's original mdast printer
	return mdastPrinter.print(path, options, print, args);
};

export const printers = {
	mdast: { ...mdastPrinter, print },
} satisfies Record<string, Printer<Nodes>>;
