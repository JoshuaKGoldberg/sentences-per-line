import { describe, expect, test } from "vitest";

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
	] as const)("%s", (input, expected) => {
		const actual = getIndexBeforeSecondSentence(input);

		expect(actual).toBe(expected);
	});
});
