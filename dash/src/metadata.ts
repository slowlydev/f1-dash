import { Metadata } from "next";

const title = "f1-dash";
const description =
  "f1-dash lets you see realtime formula 1 telemetry and timing";

const url = "https://f1-dash.vercel.app";

export const metadata: Metadata = {
  generator: "Next.js",

  applicationName: title,

  title,
  description,

  openGraph: {
    title,
    description,
    url,
  },

  twitter: {
    title,
    description,
    creator: "Slowlydev",
  },

  category: "dashboard",

  referrer: "origin-when-cross-origin",

  keywords: ["Formula 1", "F1", "dashboard", "timing", "telemetry", "realtime"],

  creator: "Slowlydev",
  publisher: "Slowlydev",
  authors: [{ name: "Slowlydev", url: "https://slowlydev.vercel.app" }],

  colorScheme: "dark",
  themeColor: "#18181B",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  assets: [
    `${url}/fonts`,
    `${url}/tires`,
    `${url}/icons`,
    `${url}/flags`,
    `${url}/country-flags`,
  ],

  metadataBase: new URL(url),

  verification: {
    google: "hKv0h7XtWgQ-pVNVKpwwb2wcCC2f0tBQ1X1IcDX50hg",
  },
};
