import { describe, expect, test, vi } from "vitest";

import { getIndexBeforeSecondSentence } from "./index.ts";

describe(getIndexBeforeSecondSentence, () => {
	test.each([
		["", undefined],
		["abc", undefined],
		["abc.", undefined],
		["Abc. Def.", 4],
		["Abc def. Ghi jkl.", 8],
		["`Abc. Def.`", undefined],
		["`Abc.` Def.", undefined],
		["`Abc.` `Def.`", undefined],
		["``Abc.`` Def.", undefined],
		["`Abc.` Def. Ghi", 11],
		["```js```.", undefined],
		["`C:\\`", undefined],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc.
Def.
`,
			undefined,
		],
		[
			`
\`\`\`plaintext
Abc. Def.
\`\`\`

Abc. Def.
`,
			33,
		],
		["Hello! World", 6],
		["Hello? World", 6],
		["Really?! Wow", 8],
		["Hello! world", undefined],
		["Hello? world", undefined],
		["Hello!", undefined],
		["Hello?", undefined],
		["Hi! Bye! Again", 3],
		["What? No! Really", 5],
		["`Hello!` World.", undefined],
		["Hey!? What are you doing?", 5],
		["Hello?world", undefined],
		["Hello!World", undefined],
		["Hello! World! Again", 6],
		["Hello! Dr. Smith", 6],
		["Hello. World! Again", 6],
		["e.g. Hello! World", 11],
		["`Hello!` World? Again", 15],
		["! World", 1],
		["`Hello?` World", undefined],
		[". World", 1],
		["Hello! ", undefined],
		["? World", 1],
		["Hello. World", 6],
		["# Heading. Second sentence.", undefined],
		["1. First sentence. Second one.", 18],
		["``abc", undefined],
		["Hello world! Another sentence!", 12],
	] as const)("%s", (input, expected) => {
		const actual = getIndexBeforeSecondSentence(input);

		expect(actual).toBe(expected);
	});

	test("returns an index when given a French abbreviation that is not ignored", () => {
		const actual = getIndexBeforeSecondSentence("Bonjour Mme. Dupont.");

		expect(actual).toBe(12);
	});

	test("returns undefined when given a French abbreviation in customIgnoredWords", () => {
		const actual = getIndexBeforeSecondSentence("Bonjour Mme. Dupont.", [
			"Mme.",
		]);

		expect(actual).toBe(undefined);
	});

	test("returns an index when given a sentence ending in a closing quotation mark", () => {
		const actual = getIndexBeforeSecondSentence(`He said "Hello." Then left.`);

		expect(actual).toBe(16);
	});

	test("returns an index when given a locale that treats the character as a terminator", () => {
		const actual = getIndexBeforeSecondSentence("Foo; Bar baz", [], "el");

		expect(actual).toBe(4);
	});

	test("returns undefined when given a terminator not used by the default locale", () => {
		const actual = getIndexBeforeSecondSentence("Foo; Bar baz");

		expect(actual).toBe(undefined);
	});

	test("returns an index when Intl.Segmenter is unavailable and a second sentence follows", () => {
		vi.stubGlobal("Intl", {});

		const actual = getIndexBeforeSecondSentence("Abc. Def.");

		expect(actual).toBe(4);
	});

	test("returns undefined when Intl.Segmenter is unavailable and the terminator is followed by a quotation mark", () => {
		vi.stubGlobal("Intl", {});

		const actual = getIndexBeforeSecondSentence(`He said "Hello." Then left.`);

		expect(actual).toBe(undefined);
	});
});
