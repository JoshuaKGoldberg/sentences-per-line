import * as prettier from "prettier";
import { describe, expect, test } from "vitest";

import * as plugin from "./index.js";

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
		["This is a sentence."],
		["First sentence. Second sentence.", "First sentence.\nSecond sentence."],
	])("%j", async (input, expected = input) => {
		const actual = await format(input, { filepath: "test.md" });
		expect(actual).toBe(expected);
	});
});
