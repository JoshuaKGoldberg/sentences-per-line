import type { SentenceNodeChild } from "mdast";

export function insertNewlineAt(
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
