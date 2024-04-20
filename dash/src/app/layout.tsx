import { type ReactNode } from "react";
import { cookies } from "next/headers";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env.mjs";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

import InfoBanner from "@/components/InfoBanner";

export default function RootLayout({ children }: { children: ReactNode }) {
	const enableTracking = !!env.NEXT_PUBLIC_ENABLE_TRACKING;

	const cookiesStore = cookies();
	const showBanner = cookiesStore.get("info-banner")?.value !== "hidden";

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

			<body>
				{showBanner && <InfoBanner />}

				<div className="p-3">{children}</div>
			</body>
		</html>
	);
}
