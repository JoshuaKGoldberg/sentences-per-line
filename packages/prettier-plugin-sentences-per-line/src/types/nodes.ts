import { WithPosition } from "./positions.js";

/**
 * Non-exhaustive list of AST nodes equivalent to @types/mdast.
 */
export type AnyNode =
	| BlockquoteNode
	| ParagraphNode
	| SentenceNode
	| WhitespaceNode
	| WordNode;

export interface BlockquoteNode extends WithPosition {
	children: ParagraphNode[];
	type: "blockquote";
}

export interface ParagraphNode extends WithPosition {
	children: AnyNode[];
	type: "paragraph";
}

export interface SentenceNode extends WithPosition {
	children: SentenceNodeChild[];
	type: "sentence";
}

export type SentenceNodeChild = WhitespaceNode | WordNode;

export interface WhitespaceNode {
	type: "whitespace";
	value: string;
}

export interface WordNode {
	hasLeadingPunctuation: boolean;
	hasTrailingPunctuation: boolean;
	isCJ: boolean;
	kind: string;
	type: "word";
	value: string;
}
