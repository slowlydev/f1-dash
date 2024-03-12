import { config } from "lib/config";
import { cron } from "lib/cron";
import { emit, emitter } from "lib/event";
import { LoggerRequest } from "lib/logger";
import { lessThan, repository } from "lib/repository";
import { reqEntity } from "./req.entity";

const reqStash: LoggerRequest[] = [];
const reqRepository = repository(reqEntity);

cron("* * * * * 0,30", () => flush());
cron("* * * * 0,30 0", () => clean());

const flush = async (): Promise<void> => {
	const endIndex = reqStash.length;
	const requests = reqStash.slice(0, endIndex);
	reqStash.splice(0, endIndex);
	if (config.databaseMode === "readwrite" && requests.length) {
		await reqRepository.insertMany(requests);
	}
};

const clean = async (): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		await reqRepository.delete({ timestamp: lessThan(Date.now() - 1000 * 60 * 60 * 24 * 14) });
	}
};

export const req = async ({ id, ip, timestamp, method, endpoint }: LoggerRequest): Promise<void> => {
	if (config.databaseMode === "readwrite") {
		reqStash.push({ id, ip, timestamp, method, endpoint });
		if (emitter.listeners("metrics").length) {
			emit("metrics", { event: "req", id, ip, timestamp, method, endpoint });
		}
		if (reqStash.length >= 1e4) await flush();
	}
};
