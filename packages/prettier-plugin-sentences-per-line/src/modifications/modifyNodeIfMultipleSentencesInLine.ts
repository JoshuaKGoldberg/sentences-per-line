import type { Blockquote, Paragraph, RootContent, SentenceNode } from "mdast";
import type { AstPath } from "prettier";

import { insertNewlineAt } from "./insertNewlineAt.ts";

export interface ModifyNodeOptions {
	knownAbbreviations?: string[];
}

export function modifyNodeIfMultipleSentencesInLine(
	path: AstPath<RootContent>,
	options: ModifyNodeOptions = {},
) {
	const node = path.node;
	if (node.type === "blockquote") {
		modifyBlockquoteNode(node, options);
	} else if (node.type === "paragraph") {
		modifyParagraphNode(node, "\n", options);
	}
}

function modifyBlockquoteNode(node: Blockquote, options: ModifyNodeOptions) {
	for (const paragraph of node.children) {
		if (paragraph.type === "paragraph") {
			modifyParagraphNode(paragraph, "> ", options);
		}
	}
}

function modifyParagraphNode(
	node: Paragraph,
	insertion: string,
	options: ModifyNodeOptions,
) {
	for (const child of node.children) {
		if (child.type === "sentence") {
			modifySentenceNode(child, insertion, options);
		}
	}
}

function modifySentenceNode(
	sentence: SentenceNode,
	insertion: string,
	{ knownAbbreviations = [] }: ModifyNodeOptions,
) {
	for (let i = 0; i < sentence.children.length - 1; i++) {
		const child = sentence.children[i];
		if (
			child.type === "word" &&
			child.value.endsWith(".") &&
			// Skip any starting list number, e.g. "1. " or " 1. "
			!/^\s*\d+\./.test(child.value) &&
			!knownAbbreviations.some((word) =>
				child.value.toLowerCase().endsWith(word.toLowerCase()),
			)
		) {
			insertNewlineAt(sentence.children, i, insertion);
		}
	}
}
