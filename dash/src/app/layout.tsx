import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

type Props = Readonly<{
	children: ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} bg-zinc-950 font-sans text-white`}>
			<head />

			{env.NEXT_PUBLIC_TRACKING_ID && env.NEXT_PUBLIC_TRACKING_URL && (
				// Umami Analytics
				<Script async defer data-website-id={env.NEXT_PUBLIC_TRACKING_ID} src={env.NEXT_PUBLIC_TRACKING_URL} />
			)}

			<body>{children}</body>
		</html>
	);
}
