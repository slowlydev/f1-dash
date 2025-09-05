import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env";
import EnvScript from "@/env-script";
import OledModeProvider from "@/components/OledModeProvider";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

type Props = Readonly<{
	children: ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} font-sans text-white`}>
			<head>
				<EnvScript />

				{env.DISABLE_IFRAME === "1" && (
					<Script strategy="beforeInteractive" id="no-embed">
						{`if (window.self !== window.top && window.location.pathname !== "/embed") {window.location.href = "/embed"; }`}
					</Script>
				)}

				{env.TRACKING_ID && env.TRACKING_URL && (
					// Umami Analytics
					<Script async defer data-website-id={env.TRACKING_ID} src={env.TRACKING_URL} />
				)}
			</head>

			<body>
				<OledModeProvider>{children}</OledModeProvider>
			</body>
		</html>
	);
}