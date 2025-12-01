import {
	AnyNode,
	BlockquoteNode,
	ParagraphNode,
	WordNode,
} from "./types/nodes.js";

export function isBlockquoteNode(node: AnyNode): node is BlockquoteNode {
	return node.type === "blockquote";
}

export function isParagraphNode(node: AnyNode): node is ParagraphNode {
	return node.type === "paragraph";
}

export function isWordNode(node: AnyNode): node is WordNode {
	return node.type === "word";
}
