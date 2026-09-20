import type { Paragraph, Text } from "mdast";

import { MarkdownRuleDefinition } from "@eslint/markdown";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

export interface OneOptions {
	additionalAbbreviations?: string[];
}

export const one: MarkdownRuleDefinition<{
	MessageIds: "multiple";
	RuleOptions: [OneOptions?];
}> = {
	create(context) {
		const additionalAbbreviations =
			context.options[0]?.additionalAbbreviations ?? [];

		function checkTextNode(node: Text) {
			// Text node values can differ from their source text, such as when a
			// trailing space is dropped before a soft line break or with escapes and
			// entities, so indices are computed from the source to keep them aligned
			// with the offsets used to report and fix.
			const index = getIndexBeforeSecondSentence(
				context.sourceCode.getText(node),
				additionalAbbreviations,
			);
			if (!index) {
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const spaceStart = node.position!.start.offset! + index;

			context.report({
				fix(fixer) {
					return fixer.replaceTextRange([spaceStart, spaceStart + 1], "\n");
				},
				loc: {
					end: context.sourceCode.getLocFromIndex(spaceStart + 1),
					start: context.sourceCode.getLocFromIndex(spaceStart),
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
		schema: [
			{
				additionalProperties: false,
				properties: {
					additionalAbbreviations: {
						description:
							"Additional abbreviations to ignore when determining sentence boundaries.",
						items: { type: "string" },
						type: "array",
					},
				},
				type: "object",
			},
		],
		type: "problem",
	},
};
