export * from "mdast";

declare module "mdast" {
	interface PositionPoint {
		column: number;
		line: number;
		offset: number;
	}

	interface Position {
		end: PositionPoint;
		start: PositionPoint;
	}

	interface Node {
		position: Position;
	}

	interface WhitespaceNode {
		type: "whitespace";
		value: string;
	}

	interface WordNode {
		hasLeadingPunctuation: boolean;
		hasTrailingPunctuation: boolean;
		isCJ: boolean;
		kind: string;
		type: "word";
		value: string;
	}

	interface SentenceBreakNode {
		type: "sentenceBreak";
	}

	type SentenceNodeChild = WhitespaceNode | WordNode | SentenceBreakNode;

	interface SentenceNode {
		children: SentenceNodeChild[];
		type: "sentence";
	}

	interface RootContentMap {
		word: WordNode;
		sentence: SentenceNode;
		sentenceBreak: SentenceBreakNode;
	}

	interface PhrasingContentMap {
		sentence: SentenceNode;
	}
}
