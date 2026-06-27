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
});
