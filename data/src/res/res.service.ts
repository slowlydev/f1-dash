import { config } from "lib/config";
import { cron } from "lib/cron";
import { emit, emitter } from "lib/event";
import { LoggerResponse } from "lib/logger";
import { lessThan, repository } from "lib/repository";
import { resEntity } from "./res.entity";

const resStash: LoggerResponse[] = [];
const resRepository = repository(resEntity);

cron("* * * * * 10,40", () => flush());
cron("* * * * 10,40 0", () => clean());

const flush = async (): Promise<void> => {
	const endIndex = resStash.length;
	const responses = resStash.slice(0, endIndex);
	resStash.splice(0, endIndex);
	if (config.databaseMode === "readwrite" && responses.length) {
		await resRepository.insertMany(responses);
	}
};

const clean = async (): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		await resRepository.delete({ timestamp: lessThan(Date.now() - 1000 * 60 * 60 * 24 * 14) });
	}
};

export const res = async ({ id, timestamp, status, time, bytes }: LoggerResponse): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		resStash.push({ id, timestamp, status, time, bytes });
		if (emitter.listeners("metrics").length) {
			emit("metrics", { event: "res", id, timestamp, status, time, bytes });
		}
		if (resStash.length >= 1e4) await flush();
	}
};
