import type { Root, RootContent, SentenceNode } from "mdast";

import { doesEndWithIgnoredWord } from "sentences-per-line";

interface ModifyNodeOptions {
	customAbbreviations?: string[];
}

/**
 * Mutates the mdast by performing a root-level structural transformation.
 *
 * This function walks the provided mdast root node and inserts custom
 * `SentenceBreak` nodes to explicitly represent sentence boundaries in the
 * tree. The mutation is performed in place and is intended to run exactly
 * once per formatting pass, prior to printing.
 */
export function modifyNodeIfMultipleSentencesInLine(
	rootNode: Root,
	options: ModifyNodeOptions = {},
) {
	const customAbbreviations = options.customAbbreviations ?? [];

	walk(rootNode, { customAbbreviations });
}

function modifySentenceNode(
	sentence: SentenceNode,
	{ customAbbreviations }: Required<ModifyNodeOptions>,
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
	node: Root | RootContent,
	{ customAbbreviations }: Required<ModifyNodeOptions>,
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
