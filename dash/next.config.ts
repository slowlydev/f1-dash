import type { NextConfig } from "next";

import pack from "./package.json" with { type: "json" };

import "@/env";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
	env: {
		version: pack.version,
	},
	headers:
		process.env.BLOCK_IFRAME === "1"
			? async () => {
					return [
						{
							source: "/(.*)",
							headers: [
								{
									type: "header",
									key: "X-Frame-Options",
									value: "SAMEORIGIN",
								},
								{
									type: "header",
									key: "Content-Security-Policy",
									value: "frame-ancestors 'self';",
								},
							],
						},
					];
				}
			: undefined,
};

export default nextConfig;
