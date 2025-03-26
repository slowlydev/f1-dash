import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullTailwindConfig = resolveConfig(tailwindConfig);
export const { theme } = fullTailwindConfig;
