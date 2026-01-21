import type { Nodes, Root } from "mdast";
import type { Printer, StringArraySupportOption } from "prettier";

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

type PluginPrinter = Printer<Nodes>;

const mdastPrinter = markdown.printers.mdast as PluginPrinter;

const { breakParent, group, line } = builders;

/**
 * Runs after the Markdown parser has produced the mdast AST and before any
 * printing occurs. This hook is used to perform structural AST transformations
 * that are required for formatting.
 *
 * This preprocess step walks the root mdast node and inserts
 * custom `sentence` and `sentenceBreak` nodes when multiple sentences are
 * detected on a single line.
 *
 * These nodes are later interpreted by the custom {@link print} implementation
 * to enforce sentence-per-line formatting.
 * @see https://prettier.io/docs/plugins#optional-preprocess
 */
const preprocess: PluginPrinter["preprocess"] = async (ast, options) => {
	const customAbbreviations =
		options.sentencesPerLineAdditionalAbbreviations as string[];

	const mdAst = (await mdastPrinter.preprocess?.(ast, options)) as Root;

	modifyNodeIfMultipleSentencesInLine(mdAst, { customAbbreviations });

	return mdAst;
};

/**
 * This function delegates printing to Prettier’s built-in Markdown printer
 * for all node types except the custom `sentence` and `sentenceBreak` nodes
 * introduced by this plugin.
 *
 * All other nodes are forwarded unchanged to the original mdast printer,
 * preserving Prettier’s default Markdown formatting behavior.
 * @see https://prettier.io/docs/plugins#print
 */
const print: PluginPrinter["print"] = (path, options, print, args) => {
	const node = path.node;

	/**
	 * `sentence` nodes are printed as a grouped Doc so that they participate
	 * correctly in line-breaking decisions and can be combined with
	 * {@link breakParent} semantics.
	 */
	if (node.type === "sentence") {
		return group(
			// @ts-expect-error -- Prettier's AstPath.call typings cannot express that
			// `children` here is `Nodes[]`; TypeScript infers `string`
			path.map(print, "children"),
		);
	}

	/**
	 * `sentenceBreak` nodes force a hard line break at the parent level by
	 *  emitting a {@link breakParent} followed by a {@link line}.
	 */
	if (node.type === "sentenceBreak") {
		return [breakParent, line];
	}

	return mdastPrinter.print(path, options, print, args);
};

/**
 * This function extends Prettier’s default mdast visitor keys to account for
 * custom node types introduced by this plugin.
 * @see https://prettier.io/docs/plugins#optional-getvisitorkeys
 */
const getVisitorKeys: PluginPrinter["getVisitorKeys"] = (
	node,
	nonTraversableKeys,
) => {
	switch (node.type) {
		case "sentence":
			return ["children"];

		case "sentenceBreak":
			return [];

		default:
			return mdastPrinter.getVisitorKeys?.(node, nonTraversableKeys) ?? [];
	}
};

export const printers = {
	mdast: {
		...mdastPrinter,
		getVisitorKeys,
		preprocess,
		print,
	},
} satisfies Record<string, PluginPrinter>;
