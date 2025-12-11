import type { AstPath } from "prettier";

import {
	AnyNode,
	BlockquoteNode,
	ParagraphNode,
	SentenceNode,
} from "../types/nodes.js";
import { insertNewlineAt } from "./insertNewlineAt.js";

export interface ModifyNodeOptions {
	knownAbbreviations?: string[];
}

export function modifyNodeIfMultipleSentencesInLine(
	path: AstPath<AnyNode>,
	options: ModifyNodeOptions = {},
) {
	if (path.node.type === "blockquote") {
		modifyBlockquoteNode(path.node, options);
	} else if (path.node.type === "paragraph") {
		modifyParagraphNode(path.node, "\n", options);
	}
}

function modifyBlockquoteNode(
	node: BlockquoteNode,
	options: ModifyNodeOptions,
) {
	for (const paragraph of node.children) {
		modifyParagraphNode(paragraph, "> ", options);
	}
}

function modifyParagraphNode(
	node: ParagraphNode,
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
