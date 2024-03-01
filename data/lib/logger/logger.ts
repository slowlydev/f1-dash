import { config } from "../config/config";
import { Config } from "../config/config.type";
import { blue, bold, cyan, green, purple, red, reset, yellow } from "./color";

export const getContext = (): string | null => {
	try {
		const stackTrace = new Error().stack;
		const callerLine = stackTrace?.split("\n")[3];
		const filepath = callerLine?.split("(")[1];
		const file = filepath?.split("/").pop();
		const filename = file?.split(":")[0];
		return filename?.endsWith(".ts") ? filename : null;
	} catch {
		return null;
	}
};

export const formatTimestamp = (timestamp: number): string => {
	const date = new Date(timestamp);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const second = date.getSeconds().toString().padStart(2, "0");
	return `${hour}:${minute}:${second}`;
};

export const makeBase = (
	timestamp: number,
	context: string | null,
	variant: Config["logLevel"] | "req" | "res",
): string => {
	const name = `${bold}${blue}[${config.name}]${reset}`;
	return `${name} (${context}) ${formatTimestamp(timestamp)} ${makeLevel(variant)}`;
};

export const makeLevel = (logLevel: Config["logLevel"] | "req" | "res"): string => {
	switch (true) {
		case logLevel === "req":
			return `${bold}req${reset}:`;
		case logLevel === "res":
			return `${bold}res${reset}:`;
		case logLevel === "trace":
			return `${bold}${purple}trace${reset}:`;
		case logLevel === "debug":
			return `${bold}${cyan}debug${reset}:`;
		case logLevel === "info":
			return `${bold}${green}info${reset}:`;
		case logLevel === "warn":
			return `${bold}${yellow}warn${reset}:`;
		case logLevel === "error":
			return `${bold}${red}error${reset}:`;
		default:
			return `${bold}${logLevel}${reset}`;
	}
};

export const mask = (uuid: string): string => {
	const length = uuid.length;
	if (length < 4) {
		return uuid;
	}
	const head = uuid.substring(0, 2);
	const tail = uuid.substring(length - 2, length);
	return `${head}..${tail}`;
};

export const trace = (message: string, stack?: unknown): void => {
	const logLevels: Config["logLevel"][] = ["trace"];
	if (logLevels.includes(config.logLevel)) {
		console.trace(`${makeBase(Date.now(), getContext(), "trace")} ${message}`, stack ?? "");
	}
};

export const debug = (message: string): void => {
	const logLevels: Config["logLevel"][] = ["trace", "debug"];
	if (logLevels.includes(config.logLevel)) {
		console.debug(`${makeBase(Date.now(), getContext(), "debug")} ${message}`);
	}
};

export const info = (message: string): void => {
	const logLevels: Config["logLevel"][] = ["trace", "debug", "info"];
	if (logLevels.includes(config.logLevel)) {
		console.info(`${makeBase(Date.now(), getContext(), "info")} ${message}`);
	}
};

export const warn = (message: string): void => {
	const logLevels: Config["logLevel"][] = ["trace", "debug", "info", "warn"];
	if (logLevels.includes(config.logLevel)) {
		console.warn(`${makeBase(Date.now(), getContext(), "warn")} ${message}`);
	}
};

export const error = (message: string, stack?: unknown): void => {
	const logLevels: Config["logLevel"][] = ["trace", "debug", "info", "warn", "error"];
	if (logLevels.includes(config.logLevel)) {
		console.error(`${makeBase(Date.now(), getContext(), "error")} ${message}`, stack ?? "");
	}
};
