import { MarkdownRuleDefinition } from "@eslint/markdown";
import { Paragraph, Text } from "mdast";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

export const one: MarkdownRuleDefinition = {
	create(context) {
		function checkTextNode(node: Text) {
			const index = getIndexBeforeSecondSentence(node.value);
			if (!index) {
				return;
			}

			/* eslint-disable @typescript-eslint/no-non-null-assertion */
			const start = node.position!.start;
			const insertion = start.offset! + index + 1;
			/* eslint-enable @typescript-eslint/no-non-null-assertion */

			context.report({
				fix(fixer) {
					return fixer.insertTextAfterRange([insertion, insertion], "\n");
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
