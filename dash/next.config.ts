import type { NextConfig } from "next";

import pack from "./package.json" with { type: "json" };

import "@/env";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**formula1.com",
				port: "",
			},
		],
	},
	env: {
		version: pack.version,
	},
};

export default nextConfig;
