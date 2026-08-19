export const defaultLocale = "en-US";

const segmenterCache = new Map<string, Intl.Segmenter>();

export function getSentenceStartIndices(
	line: string,
	locale: string,
): Set<number> | undefined {
	if (typeof Intl.Segmenter === "undefined") {
		return undefined;
	}

	let segmenter = segmenterCache.get(locale);

	if (!segmenter) {
		segmenter = new Intl.Segmenter(locale, { granularity: "sentence" });
		segmenterCache.set(locale, segmenter);
	}

	const indices = new Set<number>();

	for (const { index } of segmenter.segment(line)) {
		indices.add(index);
	}

	return indices;
}
