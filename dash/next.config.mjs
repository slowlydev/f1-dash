await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: false,
	output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.formula1.com",
				port: "",
			},
		],
	},
};

export default config;
