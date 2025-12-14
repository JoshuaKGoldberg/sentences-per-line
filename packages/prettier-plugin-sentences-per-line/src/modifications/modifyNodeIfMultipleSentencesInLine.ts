import type { Blockquote, Paragraph, RootContent, SentenceNode } from "mdast";
import type { AstPath } from "prettier";

import { insertNewlineAt } from "./insertNewlineAt.js";

export function modifyNodeIfMultipleSentencesInLine(
	path: AstPath<RootContent>,
) {
	const node = path.node;
	if (node.type === "blockquote") {
		modifyBlockquoteNode(node);
	} else if (node.type === "paragraph") {
		modifyParagraphNode(node, "\n");
	}
}

function modifyBlockquoteNode(node: Blockquote) {
	for (const paragraph of node.children) {
		if (paragraph.type === "paragraph") {
			modifyParagraphNode(paragraph, "> ");
		}
	}
}

function modifyParagraphNode(node: Paragraph, insertion: string) {
	for (const child of node.children) {
		if (child.type === "sentence") {
			modifySentenceNode(child, insertion);
		}
	}
}

function modifySentenceNode(sentence: SentenceNode, insertion: string) {
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
