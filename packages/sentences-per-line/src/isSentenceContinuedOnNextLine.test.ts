import { describe, expect, test } from "vitest";

import { isSentenceContinuedOnNextLine } from "./index.ts";

describe(isSentenceContinuedOnNextLine, () => {
	test.each([
		["This is a single sentence that spans", "multiple lines.", true],
		["Ends with a colon:", "and continues here.", true],
		["Ends with a comma,", "and continues here.", true],
		["This is a complete sentence.", "So is this one.", false],
		["Ends with a question mark?", "So does this one.", false],
		["Ends with an exclamation mark!", "So does this one.", false],
		['He said "Hello."', "Then he left.", false],
		["He said “Hello.”", "Then he left.", false],
		["He said ‘Hello.’", "Then he left.", false],
		["Some sentence.[^1]", "Another sentence.", false],
		["~~Done.~~", "Next.", false],
		["Trails off…", "Next.", false],
		["Look at the index.", "Then the next one.", false],
		["**Bold text.**", "More text.", false],
		["This is a single sentence that spans", "", false],
		["This is a single sentence that spans", undefined, false],
		["", "multiple lines.", false],
		["# Heading", "Text after a heading.", false],
		["Text before a heading", "# Heading", false],
		["> Quoted text", "> continues here.", false],
		["- List item", "continues here.", false],
		["1. List item", "continues here.", false],
		["| Cell |", "| Another cell |", false],
		["<div>", "Text inside HTML.", false],
		["```", "Text after a fence.", false],
		["~~~", "Text after a fence.", false],
		["* List item", "continues here.", false],
		["+ List item", "continues here.", false],
		["1) List item", "continues here.", false],
		[
			"[![Build](https://x/b.svg)](https://x)",
			"[![Coverage](https://x/c.svg)](https://x)",
			false,
		],
		[
			"[![npm version][npm-image]][npm-url]",
			"[![Build][build-image]][build-url]",
			false,
		],
		[
			"[Website](https://example.com) |",
			"[Docs](https://example.com/docs)",
			false,
		],
		["![Alt](x.png)", "Caption text.", false],
		["See [the docs](https://example.com) for", "more information.", true],
		["---", "Text after a thematic break.", false],
		["[ref]: https://example.com", "Text after a link definition.", false],
		["    Indented code", "    More indented code", false],
		["\t<!-- A tab-indented comment -->", "\tAnd more HTML", false],
		["A hard break  ", "continues here.", false],
		["A hard break\\", "continues here.", false],
		["A hard break<br>", "continues here.", false],
		["A hard break<br />", "continues here.", false],
		["Windows line ending\r", "continues here.\r", true],
	] as const)("%s / %s", (line, nextLine, expected) => {
		const actual = isSentenceContinuedOnNextLine(line, nextLine);

		expect(actual).toBe(expected);
	});

	test("returns true when the line ends with a standard abbreviation", () => {
		const actual = isSentenceContinuedOnNextLine(
			"Sweet fruits include, e.g.",
			"apples and oranges.",
		);

		expect(actual).toBe(true);
	});

	test("returns false when the line ends with a French abbreviation that is not ignored", () => {
		const actual = isSentenceContinuedOnNextLine("Bonjour Mme.", "Dupont.");

		expect(actual).toBe(false);
	});

	test("returns true when the line ends with a French abbreviation in customIgnoredWords", () => {
		const actual = isSentenceContinuedOnNextLine("Bonjour Mme.", "Dupont.", [
			"Mme.",
		]);

		expect(actual).toBe(true);
	});
});
