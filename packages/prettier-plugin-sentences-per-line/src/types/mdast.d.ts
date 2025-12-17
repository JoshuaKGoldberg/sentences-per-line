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

	type SentenceNodeChild = WhitespaceNode | WordNode;

	interface SentenceNode {
		children: SentenceNodeChild[];
		type: "sentence";
	}

	interface PhrasingContentMap {
		sentence: SentenceNode;
	}
}
