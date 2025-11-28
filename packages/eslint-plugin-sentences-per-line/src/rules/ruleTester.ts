import markdown from "@eslint/markdown";
import { RuleTester } from "eslint";
import * as vitest from "vitest";

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

export const ruleTester = new RuleTester({
	language: "markdown/commonmark",
	plugins: { markdown },
});
