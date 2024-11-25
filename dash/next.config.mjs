import pack from "./package.json" with { type: "json" };

await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: false,
	output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
	env: {
		version: pack.version,
	},
};

export default config;
