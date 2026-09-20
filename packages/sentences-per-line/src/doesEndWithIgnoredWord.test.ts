import { describe, expect, it } from "vitest";

import {
	doesEndWithIgnoredWord,
	ignoredWords,
} from "./doesEndWithIgnoredWord.ts";

describe(doesEndWithIgnoredWord, () => {
	it.each(ignoredWords)(
		"should return true for standard ignored words alone (%s)",
		(word) => {
			expect(doesEndWithIgnoredWord(word)).toBe(true);
		},
	);

	it.each(ignoredWords)(
		"should return true for standard ignored words at the end of a line (%s)",
		(word) => {
			const input = `This is an example ${word}`;
			expect(doesEndWithIgnoredWord(input)).toBe(true);
		},
	);

	it.each(ignoredWords)(
		"should return false for standard ignored words at the start of a line (%s)",
		(word) => {
			const input = `${word} This is an example`;
			expect(doesEndWithIgnoredWord(input)).toBe(false);
		},
	);

	it.each([
		["Look at the index.", "ex."],
		["I baked a pie.", "ie."],
		["Say hi to Greg.", "eg."],
	])(
		"should return false when an ignored word is the end of a longer word (%s)",
		(input) => {
			expect(doesEndWithIgnoredWord(input)).toBe(false);
		},
	);

	it("should return true for an ignored word after an opening parenthesis", () => {
		expect(doesEndWithIgnoredWord("Sweet fruits (e.g.")).toBe(true);
	});

	it("should return true for custom ignored words", () => {
		const customWords = ["custom.", "test."];
		expect(doesEndWithIgnoredWord("This is a custom.", customWords)).toBe(true);
		expect(doesEndWithIgnoredWord("This is a test.", customWords)).toBe(true);
	});
});
