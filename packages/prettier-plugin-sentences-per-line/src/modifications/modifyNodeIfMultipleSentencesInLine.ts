import type { RootContent, SentenceNode } from "mdast";
import type { AstPath } from "prettier";

import { doesEndWithIgnoredWord } from "sentences-per-line";

export interface ModifyNodeOptions {
	customAbbreviations?: string[];
}

/**
 * This function mutates the AST structure (inserts SentenceBreak nodes),
 * but only once per printed document.
 * It receives an AstPath for the root.
 * Caller should ensure it's only invoked for the root node).
 */
export function modifyNodeIfMultipleSentencesInLine(
	path: AstPath<RootContent>,
	options: ModifyNodeOptions = {},
) {
	const customAbbreviations = options.customAbbreviations ?? [];

	walk(path.node, { customAbbreviations });
}

function modifySentenceNode(
	sentence: SentenceNode,
	{ customAbbreviations = [] }: ModifyNodeOptions,
) {
	const children = sentence.children;

	for (let i = children.length - 2; i >= 0; i--) {
		const child = children[i];

		if (
			child.type === "word" &&
			child.value.endsWith(".") &&
			// Skip any starting list number, e.g. "1. " or " 1. "
			!/^\s*\d+\./.test(child.value) &&
			!doesEndWithIgnoredWord(child.value, customAbbreviations)
		) {
			// REMOVE following whitespace to avoid double breaks / extra indent
			if (children[i + 1].type === "whitespace") {
				children.splice(i + 1, 1);
			}

			// Insert structural break
			children.splice(i + 1, 0, { type: "sentenceBreak" });
		}
	}
}

function walk(
	node: RootContent,
	{ customAbbreviations = [] }: ModifyNodeOptions,
) {
	// If the node has children, traverse them.
	if ("children" in node && Array.isArray(node.children)) {
		for (const child of node.children) {
			// If child is a sentence, process it structurally
			if (child.type === "sentence") {
				modifySentenceNode(child, { customAbbreviations });
				continue;
			}

			// otherwise recurse
			walk(child as RootContent, { customAbbreviations });
		}
	}
}
