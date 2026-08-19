import type { Paragraph, Text } from "mdast";

import { MarkdownRuleDefinition } from "@eslint/markdown";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

export const one: MarkdownRuleDefinition = {
	create(context) {
		function checkTextNode(node: Text) {
			// Text node values can differ in length from their source text, such as
			// with escapes and entities, so indices are computed from the source to
			// keep them aligned with the offsets used to report and fix.
			const index = getIndexBeforeSecondSentence(
				context.sourceCode.getText(node),
			);
			if (!index) {
				return;
			}

			/* eslint-disable @typescript-eslint/no-non-null-assertion */
			const start = node.position!.start;
			const spaceStart = start.offset! + index;
			/* eslint-enable @typescript-eslint/no-non-null-assertion */

			context.report({
				fix(fixer) {
					return fixer.replaceTextRange([spaceStart, spaceStart + 1], "\n");
				},
				loc: {
					end: {
						column: start.column + index + 1,
						line: start.line,
					},
					start: {
						column: start.column + index,
						line: start.line,
					},
				},
				messageId: "multiple",
			});
		}

		return {
			paragraph(node: Paragraph) {
				for (const child of node.children) {
					if (child.type === "text") {
						checkTextNode(child);
					}
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Limits Markdown sentences to one per line.",
		},
		fixable: "code",
		messages: {
			multiple: "Each sentence should be on its own line.",
		},
		schema: [],
		type: "problem",
	},
};
