export const defaultLocale = "en-US";

const segmenterCache = new Map<string, Intl.Segmenter>();

export function getSentenceStartIndices(
	line: string,
	locale: string,
): Set<number> | undefined {
	if (typeof Intl === "undefined" || typeof Intl.Segmenter === "undefined") {
		return undefined;
	}

	let segmenter = segmenterCache.get(locale);

	if (!segmenter) {
		segmenter = createSegmenter(locale);
		segmenterCache.set(locale, segmenter);
	}

	const indices = new Set<number>();

	for (const { index } of segmenter.segment(line)) {
		indices.add(index);
	}

	return indices;
}

function createSegmenter(locale: string) {
	try {
		// Falling back to the default locale keeps results consistent across machines
		// when the runtime doesn't have data for the requested locale.
		return new Intl.Segmenter([locale, defaultLocale], {
			granularity: "sentence",
		});
	} catch (error) {
		throw new RangeError(
			`Invalid locale "${locale}": expected a BCP 47 language tag such as "${defaultLocale}".`,
			{ cause: error },
		);
	}
}
