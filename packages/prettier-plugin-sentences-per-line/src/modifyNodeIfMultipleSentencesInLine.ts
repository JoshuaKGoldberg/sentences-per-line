import type { AstPath } from "prettier";

import {
	AnyNode,
	SentenceNode,
	SentenceNodeChild,
	WordNode,
} from "./types/nodes.js";

export function modifyNodeIfMultipleSentencesInLine(path: AstPath<AnyNode>) {
	if (!isSentenceNode(path.node)) {
		return;
	}

	for (let i = 0; i < path.node.children.length - 1; i++) {
		const child = path.node.children[i];
		if (isWordNode(child) && child.value.endsWith(".")) {
			insertNewlineAt(path.node.children, i);
		}
	}
}

function insertNewlineAt(children: SentenceNodeChild[], index: number) {
	const newWhitespace: SentenceNodeChild = {
		hasLeadingPunctuation: false,
		hasTrailingPunctuation: false,
		isCJ: false,
		kind: "whitespace",
		type: "word",
		value: "\n",
	};

	if (children[index + 1].type === "whitespace") {
		children[index + 1] = newWhitespace;
	} else {
		children.splice(index + 1, 0, newWhitespace);
	}
}

function isSentenceNode(node: AnyNode): node is SentenceNode {
	return node.type === "sentence";
}

function isWordNode(node: AnyNode): node is WordNode {
	return node.type === "word";
}
