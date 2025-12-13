import * as prettier from "prettier";
import { describe, expect, test } from "vitest";

import * as plugin from "./index.ts";

function format(code: string, options: prettier.Options) {
	return prettier.format(code, {
		...options,
		parser: "markdown",
		plugins: [plugin],
	});
}

describe("Tests", () => {
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
	])("%j", async (input, expected = input) => {
		const actual = await format(input, { filepath: "test.md" });
		expect(actual).toBe(expected);
	});

	test("with additionalAbbreviations", async () => {
		const input = "i.e. I.M. Pei.";
		const expected = "i.e. I.M. Pei.\n";

		const actual = await format(input, {
			additionalAbbreviations: ["I.M."],
			filepath: "test.md",
		});
		expect(actual).toBe(expected);
	});
});
