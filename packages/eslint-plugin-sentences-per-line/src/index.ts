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
					paragraphs: plugin,
				},
				rules: Object.fromEntries(
					Object.entries(rules).map(([name]) => [
						"paragraphs/" + name,
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
