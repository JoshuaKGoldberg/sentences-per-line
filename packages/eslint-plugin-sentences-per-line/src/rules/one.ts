import type { Paragraph, Text } from "mdast";

import { MarkdownRuleDefinition } from "@eslint/markdown";
import { getIndexBeforeSecondSentence } from "sentences-per-line";

export interface OneOptions {
	additionalAbbreviations?: string[];
	locale?: string;
}

export const one: MarkdownRuleDefinition<{
	MessageIds: "multiple";
	RuleOptions: [OneOptions?];
}> = {
	create(context) {
		const additionalAbbreviations =
			context.options[0]?.additionalAbbreviations ?? [];
		const locale = context.options[0]?.locale;

		function checkTextNode(node: Text) {
			const index = getIndexBeforeSecondSentence(
				context.sourceCode.getText(node),
				additionalAbbreviations,
				locale,
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
					locale: {
						description:
							"BCP 47 locale tag to use when detecting sentence boundaries.",
						minLength: 1,
						type: "string",
					},
				},
				type: "object",
			},
		],
		type: "problem",
	},
};
