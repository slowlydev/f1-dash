import { Env } from "bun";

export const colorTerminal = (env: Env): boolean => {
	if (env.FORCE_COLOR) {
		return true;
	}
	if (env.NO_COLOR) {
		return false;
	}
	if (env.TERM && env.TERM.includes("color")) {
		return true;
	}
	return false;
};

export const purple = colorTerminal(process.env) ? "\x1b[35m" : "";
export const blue = colorTerminal(process.env) ? "\x1b[34m" : "";
export const cyan = colorTerminal(process.env) ? "\x1b[36m" : "";
export const green = colorTerminal(process.env) ? "\x1b[32m" : "";
export const yellow = colorTerminal(process.env) ? "\x1b[33m" : "";
export const red = colorTerminal(process.env) ? "\x1b[31m" : "";
export const bold = colorTerminal(process.env) ? "\x1b[1m" : "";
export const reset = colorTerminal(process.env) ? "\x1b[0m" : "";
