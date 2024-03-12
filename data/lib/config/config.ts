import { Env } from "bun";
import { readFileSync } from "fs";
import { boolean } from "../validation/boolean/boolean";
import { number } from "../validation/number/number";
import { object } from "../validation/object/object";
import { string } from "../validation/string/string";
import { union } from "../validation/union/union";
import { Config } from "./config.type";
import { determineStage } from "./stage";

// TODO: remove as not needed when using const
let validatedConfig: Config;

export const validateConfig = (env: Env): Config => {
	try {
		const schema = object({
			stage: union(["test", "stage", "dev", "prod"]).optional(),
			port: number().optional().transform().min(0).max(65535).default(4000),
			name: string().optional().max(12).default("f1-data"),

			f1BaseUrl: string().optional().min(4).max(256).default("livetiming.formula1.com"),
			allowOrigin: string().optional().default("*"),
			globalPrefix: string().optional().max(12).default(""),
			defaultVersion: number().optional().transform().min(1).default(0),

			cacheTtl: number().optional().transform().min(0).default(0),
			cacheLimit: number().optional().transform().min(0).default(0),

			throttleTtl: number().optional().transform().min(0).default(0),
			throttleLimit: number().optional().transform().min(0).default(0),

			databasePath: string().optional().default(":memory:"),
			databaseMode: union(["readwrite", "readonly"]).optional().default("readwrite"),

			logLevel: union(["trace", "debug", "info", "warn", "error"]).optional().default("info"),
			logRequests: boolean().optional().transform().default(false),
			logResponses: boolean().optional().transform().default(false),
		});
		const config = schema.parse({
			stage: determineStage(env.npm_lifecycle_event, env.NODE_ENV),
			port: env.PORT,
			name: env.NAME,
			f1BaseUrl: env.F1_BASE_URL,
			allowOrigin: env.ALLOW_ORIGIN,
			globalPrefix: env.GLOBAL_PREFIX,
			defaultVersion: env.DEFAULT_VERSION,
			cacheTtl: env.CACHE_TTL,
			cacheLimit: env.CACHE_LIMIT,
			throttleTtl: env.THROTTLE_TTL,
			throttleLimit: env.THROTTLE_LIMIT,
			databasePath: env.DATABASE_PATH,
			databaseMode: env.DATABASE_MODE,
			logLevel: env.LOG_LEVEL,
			logRequests: env.LOG_REQUESTS,
			logResponses: env.LOG_RESPONSES,
		});

		return config;
	} catch (err) {
		throw `config: ${(err as { message?: string })?.message}`;
	}
};

// FIXME: remove this hacky workaround when bun implements a hot reloaded env
export const hotReloadEnv = (env: string): void => {
	if (env && determineStage(process.env.npm_lifecycle_event, process.env.NODE_ENV) === "dev") {
		const lines = env
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length)
			.filter((line) => !line.startsWith("#"));
		lines.forEach((line) => (process.env[line.split("=")[0]] = line.split("=")[1]));
		validatedConfig = validateConfig(process.env);
	}
};

// TODO: remove function call
try {
	hotReloadEnv(readFileSync(".env", "utf8"));
} catch {
	null;
}

// TODO: make this const again and rename to config for direct export
validatedConfig = validateConfig(process.env);
export { validatedConfig as config };
