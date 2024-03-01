import { Env } from "bun";
import { boolean, number, object, string } from "../validation";
import { Config } from "./config.type";
import { union } from "../validation/";

export const validateConfig = (env: Env): Config => {
	try {
		const schema = object({
			port: number().optional().transform().min(0).max(65535).default(4000),
			f1BaseUrl: string().optional().min(8).max(256).default("wss://livetiming.formula1.com/signalr"),
			f1NegotiateUrl: string().optional().min(8).max(256).default("https://livetiming.formula1.com/signalr"),
			testing: boolean().optional().default(false),
			logLevel: union(["trace", "debug", "info", "warn", "error"]).optional().default("info"),
		});
		const config = schema.parse({
			port: env.PORT,
			f1BaseUrl: env.F1_BASE_URL,
			f1NegotiateUrl: env.F1_NEGOTIATE_URL,
			testing: env.TESTING,
		});

		return config;
	} catch (err) {
		throw `config: ${(err as { message?: string })?.message}`;
	}
};

export const config = validateConfig(process.env);
