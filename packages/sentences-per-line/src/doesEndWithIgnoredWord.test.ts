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

	it("should return true for custom ignored words", () => {
		const customWords = ["custom.", "test."];
		expect(doesEndWithIgnoredWord("This is a custom.", customWords)).toBe(true);
		expect(doesEndWithIgnoredWord("This is a test.", customWords)).toBe(true);
	});
});
