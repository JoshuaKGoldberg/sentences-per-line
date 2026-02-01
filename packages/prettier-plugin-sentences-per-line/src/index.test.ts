import { readFile } from "node:fs/promises";
import path from "node:path";
import * as prettier from "prettier";
import { describe, expect, test } from "vitest";

import * as plugin from "./index.ts";

function format(code: string, options: prettier.Options): Promise<string> {
	return prettier.format(code, {
		...options,
		parser: "markdown",
		plugins: [plugin],
	});
}

describe("index", () => {
	test.each([
		[""],
		[" ", ""],
		["This is a sentence.", "This is a sentence.\n"],
		[
			"This is a sentence `with. inline. code.`.",
			"This is a sentence `with. inline. code.`.\n",
		],
		["This is a sentence.\n"],
		["1. List.\n"],
		["## 1. List.\n"],
		["First sentence. Second sentence.", "First sentence.\nSecond sentence.\n"],
		[
			"First sentence.\tSecond sentence.",
			"First sentence.\nSecond sentence.\n",
		],
		[
			"First sentence.  \t\t  Second sentence.",
			"First sentence.\nSecond sentence.\n",
		],
		[
			"First sentence. Second sentence. Third sentence.",
			"First sentence.\nSecond sentence.\nThird sentence.\n",
		],
		["> First sentence.\n"],
		["> First sentence.\n> Second sentence.\n"],
		["This vs. that.\n"],
		["e.g. first example.\n"],
		["E.g. first example.\n"],
		["ex. one.\n"],
		["Ex. one.\n"],
		["i.e. first example.\n"],
		["I.E. first example.\n"],

		// https://github.com/JoshuaKGoldberg/sentences-per-line/issues/938
		[
			[
				"> [!NOTE]",
				"> These values are the list of possible `process.platform`\n",
			].join("\n"),
			[
				"> [!NOTE]",
				"> These values are the list of possible `process.platform`\n",
			].join("\n"),
		],
	])("%j", async (input, expected = input) => {
		const actual = await format(input, { filepath: "test.md" });
		expect(actual).toBe(expected);
	});

	describe("snapshots", () => {
		const testDir = path.join(import.meta.dirname, "..", "tests");

		test.each(["nested-list", "block-quote-multi"])("%s", async (name) => {
			const inputPath = path.join(testDir, `${name}.md`);
			const snapPath = path.join(testDir, `${name}.expected.md`);

			const input = await readFile(inputPath, "utf-8");

			const output = await format(input, { filepath: inputPath });
			await expect(output).toMatchFileSnapshot(snapPath);
		});
	});

	describe("List", () => {
		test.each<[string, string, string]>([
			[
				"Single item",
				"- item with another line after.\nNew Line\n",
				"- item with another line after.\n  New Line\n",
			],
			[
				"Single item with nested item, both with multiple lines",
				[
					"- List item. New Line",
					"  - List item nested. New Line nested\n",
				].join("\n"),
				[
					"- List item.",
					"  New Line",
					"  - List item nested.",
					"    New Line nested\n",
				].join("\n"),
			],
			[
				"Single item with nested item, both with multiple lines",
				[
					"- List item A. New Line nested.",
					"- List item B",
					"- List item C. New Line",
					"  - List item nested D. New Line nested\n",
				].join("\n"),
				[
					"- List item A.",
					"  New Line nested.",
					"- List item B",
					"- List item C.",
					"  New Line",
					"  - List item nested D.",
					"    New Line nested\n",
				].join("\n"),
			],
		])("%s", async (_, input, expected = input) => {
			const actual = await format(input, { filepath: "test.md" });
			expect(actual).toBe(expected);
		});
	});

	test("Should not break sentence when the final word matches an entry in sentencesPerLineAdditionalAbbreviations", async () => {
		const input = "i.e. I.M. Pei.";
		const expected = "i.e. I.M. Pei.\n";

		const actual = await format(input, {
			filepath: "test.md",
			sentencesPerLineAdditionalAbbreviations: ["I.M."],
		});
		expect(actual).toBe(expected);
	});
});
