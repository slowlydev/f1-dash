import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import next from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
	// import.meta.dirname is available after Node.js v20.11.0
	baseDirectory: import.meta.dirname,
});

const eslintConfig = [...nextCoreWebVitals, ...next, ...nextTypescript, ...compat.config({
    extends: ["prettier"]
}), {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
