await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: false,
	output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
};

export default config;
