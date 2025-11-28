import { createRequire } from "node:module";

import { rules } from "./rules/index.js";

const require = createRequire(import.meta.url || __filename);

const { name, version } = require("../package.json") as {
	name: string;
	version: string;
};

const plugin = {
	configs: {
		get recommended() {
			return {
				plugins: {
					"sentences-per-line": plugin,
				},
				rules: Object.fromEntries(
					Object.entries(rules).map(([name]) => [
						"sentences-per-line/" + name,
						"error" as const,
					]),
				),
			};
		},
	},
	meta: {
		name,
		version,
	},
	rules,
};

export default plugin;
