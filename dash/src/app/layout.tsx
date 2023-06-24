"use client";

import { Inter } from "next/font/google";
import { type ReactNode } from "react";

import "@/styles/globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-zinc-900 p-3 font-sans text-white`}
    >
      <head />

      <Script
        async
        defer
        data-website-id="f1f0eb93-0656-4791-900d-b9a1b0e7af96"
        src="https://slowly-base.vercel.app/rep.js"
      />

      <body>{children}</body>
    </html>
  );
}
