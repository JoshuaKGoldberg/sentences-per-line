import type { RootContent } from "mdast";
import type { AstPath, Printer } from "prettier";

import * as markdown from "prettier/plugins/markdown";

import { modifyNodeIfMultipleSentencesInLine } from "./modifications/modifyNodeIfMultipleSentencesInLine.ts";

export const parsers = {
	...markdown.parsers,
};

// @ts-expect-error -- markdown does not provide public exports
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	mdast: {
		...mdastPrinter,
		print(path: AstPath<RootContent>, options, print, args) {
			modifyNodeIfMultipleSentencesInLine(path);
			return mdastPrinter.print(path, options, print, args);
		},
	},
} satisfies Record<string, Printer>;
