import { Metadata } from "next";

export const metadata: Metadata = {
  generator: "Next.js",

  applicationName: "f1-dash",
  title: "f1-dash",
  description: "f1-dash lets you see realtime formula 1 telemetry and timing",

  category: "dashboard",

  referrer: "origin-when-cross-origin",

  keywords: ["Formula 1", "F1", "dashboard", "timing", "telemetry", "realtime"],

  authors: [{ name: "Slowlydev", url: "https://slowlydev.vercel.app" }],
  creator: "Slowlydev",
  publisher: "Slowlydev",

  colorScheme: "dark",
  themeColor: "#18181B",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  assets: [
    "https://f1-dash.vercel.app/fonts",
    "https://f1-dash.vercel.app/tires",
    "https://f1-dash.vercel.app/icons",
    "https://f1-dash.vercel.app/flags",
    "https://f1-dash.vercel.app/country-flags",
  ],

  metadataBase: new URL("https://f1-dash.vercel.app"),

  verification: {
    google: "hKv0h7XtWgQ-pVNVKpwwb2wcCC2f0tBQ1X1IcDX50hg",
  },
};
