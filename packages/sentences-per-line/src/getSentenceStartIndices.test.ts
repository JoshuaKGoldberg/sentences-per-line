import { describe, expect, it } from "vitest";

import {
	defaultLocale,
	getSentenceStartIndices,
} from "./getSentenceStartIndices.ts";

describe(getSentenceStartIndices, () => {
	it("returns the start index of each sentence when given multiple sentences", () => {
		const actual = getSentenceStartIndices("Abc. Def.", defaultLocale);

		expect(actual).toEqual(new Set([0, 5]));
	});

	it("returns a single start index when given one sentence", () => {
		const actual = getSentenceStartIndices("Abc def.", defaultLocale);

		expect(actual).toEqual(new Set([0]));
	});

	it("returns start indices for a locale-specific terminator when given that locale", () => {
		const actual = getSentenceStartIndices("Foo; Bar baz", "el");

		expect(actual).toEqual(new Set([0, 5]));
	});

	it("throws a descriptive error when given an invalid locale", () => {
		expect(() => getSentenceStartIndices("Abc. Def.", "en_US")).toThrow(
			'Invalid locale "en_US": expected a BCP 47 language tag such as "en-US".',
		);
	});
});
