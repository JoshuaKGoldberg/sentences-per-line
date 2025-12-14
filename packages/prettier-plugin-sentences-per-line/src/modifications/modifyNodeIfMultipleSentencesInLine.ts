import type { AstPath } from "prettier";

import {
	AnyNode,
	BlockquoteNode,
	ParagraphNode,
	SentenceNode,
} from "../types/nodes.ts";
import { insertNewlineAt } from "./insertNewlineAt.ts";

export function modifyNodeIfMultipleSentencesInLine(path: AstPath<AnyNode>) {
	if (path.node.type === "blockquote") {
		modifyBlockquoteNode(path.node);
	} else if (path.node.type === "paragraph") {
		modifyParagraphNode(path.node, "\n");
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
