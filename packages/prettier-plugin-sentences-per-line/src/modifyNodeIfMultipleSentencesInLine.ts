import type { AstPath } from "prettier";

import {
	AnyNode,
	BlockquoteNode,
	ParagraphNode,
	SentenceNode,
	SentenceNodeChild,
} from "./types/nodes.js";

export function modifyNodeIfMultipleSentencesInLine(path: AstPath<AnyNode>) {
	if (path.node.type === "blockquote") {
		modifyBlockquoteNode(path.node);
	} else if (path.node.type === "paragraph") {
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
	for (const child of node.children) {
		if (child.type === "sentence") {
			modifySentenceNode(child, insertion);
		}
	}
}

function modifySentenceNode(sentence: SentenceNode, insertion: string) {
	if (sentence.children.length > 1) {
		for (let i = 0; i < sentence.children.length - 1; i++) {
			const child = sentence.children[i];
			if (
				child.type === "word" &&
				child.value.endsWith(".") &&
				!/^\s*\d+\./.test(child.value)
			) {
				insertNewlineAt(sentence.children, i, insertion);
			}
		}
	}
}
