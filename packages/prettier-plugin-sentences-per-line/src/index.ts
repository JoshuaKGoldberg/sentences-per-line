import type { AstPath, Printer } from "prettier";

import * as markdown from "prettier/plugins/markdown";

import type { CollectibleNode } from "./types.js";

// @ts-expect-error -- markdown does not provide public exports
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	mdast: {
		...mdastPrinter,
		print(path: AstPath<CollectibleNode>, options, print, args) {
			// TODO: Add node modification for sentences-per-line here.
			console.log("How do we get this console.log to hit?");
			return mdastPrinter.print(path, options, print, args);
		},
	},
} satisfies Record<string, Printer>;
