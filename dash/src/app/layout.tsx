import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env.mjs";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

export default function RootLayout({ children }: { children: ReactNode }) {
	const enableTracking = !!env.NEXT_PUBLIC_ENABLE_TRACKING;

	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} bg-zinc-950 font-sans text-white`}>
			<head />

			{enableTracking && (
				<Script
					async
					defer
					data-website-id="f1f0eb93-0656-4791-900d-b9a1b0e7af96"
					src="https://base.slowly.dev/rep.js"
				/>
			)}

			<body>{children}</body>
		</html>
	);
}
