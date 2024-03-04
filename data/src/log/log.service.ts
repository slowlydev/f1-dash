import { config } from "lib/config";
import { cron } from "lib/cron";
import { emit, emitter } from "lib/event";
import { LoggerDebug, LoggerError, LoggerInfo, LoggerWarn } from "lib/logger";
import { lessThan, repository } from "lib/repository";
import { Log, logEntity } from "./log.entity";

const logStash: Omit<Log, "id">[] = [];
const logRepository = repository(logEntity);

cron("* * * * * 20,50", () => flush());
cron("* * * * 20,50 0", () => clean());

const flush = async (): Promise<void> => {
	const endIndex = logStash.length;
	const logs = logStash.slice(0, endIndex);
	logStash.splice(0, endIndex);
	if (config.databaseMode === "readwrite" && logs.length) {
		await logRepository.insertMany(logs);
	}
};

const clean = async (): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		await logRepository.delete({ timestamp: lessThan(Date.now() - 1000 * 60 * 60 * 24 * 14) });
	}
};

export const debug = async ({ timestamp, context, message }: LoggerDebug): Promise<void> => {
	if (
		context !== "boot.ts" &&
		context !== "logger.ts" &&
		!message.endsWith(";") &&
		!message.includes(`emitting to channel 'metrics'`)
	) {
		if (config.databaseMode === "readwrite") {
			logStash.push({ timestamp, level: "debug", context, message, stack: null });
		}
		if (emitter.listeners("metrics").length) {
			emit("metrics", { event: "log", timestamp, level: "debug", context, message });
		}
		if (logStash.length >= 1e4) await flush();
	}
};

export const info = async ({ timestamp, context, message }: LoggerInfo): Promise<void> => {
	if (context !== "boot.ts") {
		if (config.databaseMode === "readwrite") {
			logStash.push({ timestamp, level: "info", context, message, stack: null });
		}
		if (emitter.listeners("metrics").length) {
			emit("metrics", { event: "log", timestamp, level: "info", context, message });
		}
		if (logStash.length >= 1e4) await flush();
	}
};

export const warn = async ({ timestamp, context, message }: LoggerWarn): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		logStash.push({ timestamp, level: "warn", context, message, stack: null });
	}
	if (emitter.listeners("metrics").length) {
		emit("metrics", { event: "log", timestamp, level: "warn", context, message });
	}
	if (logStash.length >= 1e4) await flush();
};

export const error = async ({ timestamp, context, message, stack }: LoggerError): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		logStash.push({ timestamp, level: "error", context, message, stack: `${stack}` ?? null });
	}
	if (emitter.listeners("metrics").length) {
		emit("metrics", { event: "log", timestamp, level: "error", context, message, stack: `${stack}` });
	}
	if (logStash.length >= 1e4) await flush();
};
