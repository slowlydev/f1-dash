import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { cookies } from "next/headers";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env.mjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

import InfoBanner from "@/components/InfoBanner";

export default function RootLayout({ children }: { children: ReactNode }) {
	const disableTracking = !!env.NEXT_PUBLIC_DISABLE_TRACKING;

	const cookiesStore = cookies();
	const showBanner = cookiesStore.get("v2-banner")?.value !== "hidden";

	return (
		<html lang="en" className={`${inter.variable} bg-zinc-900 font-sans text-white`}>
			<head />

			{!disableTracking && (
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
