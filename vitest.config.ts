import { readdirSync } from "node:fs";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			include: ["packages/*/src/"],
		},

		projects: readdirSync("./packages").map((name) => ({
			test: {
				clearMocks: true,
				include: ["**/src/**/*.test.ts"],
				name,
				root: `./packages/${name}`,
				setupFiles: ["console-fail-test/setup"],
			},
		})),
	},
});
