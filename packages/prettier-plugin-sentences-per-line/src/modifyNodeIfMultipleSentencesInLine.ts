import type { AstPath } from "prettier";

import { isBlockquoteNode, isParagraphNode, isWordNode } from "./predicates.js";
import {
	AnyNode,
	BlockquoteNode,
	ParagraphNode,
	SentenceNodeChild,
} from "./types/nodes.js";

export function modifyNodeIfMultipleSentencesInLine(path: AstPath<AnyNode>) {
	if (isBlockquoteNode(path.node)) {
		modifyBlockquoteNode(path.node);
	} else if (isParagraphNode(path.node)) {
		modifyParagraphNode(path.node, "\n");
	}
}

function insertNewlineAt(
	children: SentenceNodeChild[],
	index: number,
	insertion: string,
) {
	const newWhitespace: SentenceNodeChild = {
		hasLeadingPunctuation: false,
		hasTrailingPunctuation: false,
		isCJ: false,
		kind: "whitespace",
		type: "word",
		value: insertion,
	};

	if (children[index + 1].type === "whitespace") {
		children[index + 1] = newWhitespace;
	} else {
		children.splice(index + 1, 0, newWhitespace);
	}
}

function modifyBlockquoteNode(node: BlockquoteNode) {
	for (const paragraph of node.children) {
		modifyParagraphNode(paragraph, "> ");
	}
}

function modifyParagraphNode(node: ParagraphNode, insertion: string) {
	for (const sentence of node.children) {
		for (let i = 0; i < sentence.children.length - 1; i++) {
			const child = sentence.children[i];
			if (
				isWordNode(child) &&
				child.value.endsWith(".") &&
				!/^\s*\d+\./.test(child.value)
			) {
				insertNewlineAt(sentence.children, i, insertion);
			}
		}
	}
}
