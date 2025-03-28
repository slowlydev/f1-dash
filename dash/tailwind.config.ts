import { type Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
			},
			screens: {
				"3xl": "1800px",
			},
			colors: {
				popover: "rgba(37, 37, 37, 0.9)",
				primary: {dark:"#27272a", light: "#d8d8d5"}, // zinc-800
				secondary: {dark: "#3f3f46", light: "#c0c0b9"}, // zinc-700
				tertiary: {dark: "#52525c", light: "#adada3"}, // zinc-600
				modal: {dark: "#18181b",light:"#e7e7e4"}, // zinc-900
				background: {dark: "#09090b", light: "#f6f6f4"} // zinc-950
			},
		},
	},
	plugins: [],
} satisfies Config;
