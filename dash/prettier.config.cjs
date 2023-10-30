/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
	arrowParens: "always",
	semi: true,
  printWidth: 120,
	singleQuote: false,
	useTabs: true,
	tabWidth: 2,
	trailingComma: "all",
	endOfLine: "lf"
};

module.exports = config;
