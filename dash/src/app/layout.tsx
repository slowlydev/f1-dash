import { Inter } from "next/font/google";
import { type ReactNode } from "react";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-zinc-900 p-4 font-sans text-white`}
    >
      <head />
      <body>{children}</body>
    </html>
  );
}
