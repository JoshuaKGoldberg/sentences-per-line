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
		// ["", ""],
		// ["This is a sentence.", "This is a sentence."],
		["First sentence. Second sentence.", "First sentence.\nSecond sentence."],
	])("%j", async (input, filepath = "test.md") => {
		const output = await format(input, { filepath });
		const snapshot = `
${createLine(" Input ")}
${input.trimEnd()}

${createLine(" Output ")}
${output.trimEnd()}
`;
		expect(snapshot).toMatchSnapshot();
	});
});

const createLine = (text = "") => {
	const space = 80 - text.length;
	const before = Math.floor(space / 2);
	const after = space - before;

	return "-".repeat(before) + text + "-".repeat(after);
};
