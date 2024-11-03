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
				"f1-dark": "#0E0E10",
			},
		},
	},
	plugins: [],
} satisfies Config;
