import { WithPosition } from "./positions.js";

export type AnyNode =
	| OtherNode
	| ParagraphNode
	| SentenceNode
	| WhitespaceNode
	| WordNode;

export interface OtherNode extends WithPosition {
	type: string;
}

export interface ParagraphNode extends WithPosition {
	children: SentenceNode[];
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
