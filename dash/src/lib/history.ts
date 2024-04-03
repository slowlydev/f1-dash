import { duration } from "moment";

import { Update } from "@/types/state.type";
import { FrontGapHistory, History, LapTimeHistory, LeaderGapHistory, SectorsHistory } from "@/types/history.type";

type ArrayObject<T> = {
	[key: string]: T[];
};

const updateArrayObject = <T>(base: ArrayObject<T>, update: ArrayObject<T>): ArrayObject<T> => {
	const result = { ...base };

	for (const [key, array] of Object.entries(update)) {
		if (!result[key]) result[key] = [];
		result[key] = [...result[key], ...array];
	}

	return result;
};

export const updateHistory = (base: History, update: History): History => {
	if (Object.keys(update).length < 1) return base;

	const result = { ...base };

	if (update.gapFront) {
		result.gapFront = updateArrayObject(result.gapFront ?? {}, update.gapFront);
	}

	if (update.gapLeader) {
		result.gapLeader = updateArrayObject(result.gapLeader ?? {}, update.gapLeader);
	}

	if (update.lapTime) {
		result.lapTime = updateArrayObject(result.lapTime ?? {}, update.lapTime);
	}

	if (update.sectors) {
		if (!result.sectors) result.sectors = {};

		for (const [key, driver] of Object.entries(update.sectors)) {
			result.sectors[key] = updateArrayObject(result.sectors[key], driver);
		}
	}

	if (update.weather) {
		result.weather = {};
		result.weather.airTemp = [...(result.weather.airTemp ?? []), ...(update.weather.airTemp ?? [])];
		result.weather.humidity = [...(result.weather.humidity ?? []), ...(update.weather.humidity ?? [])];
		result.weather.pressure = [...(result.weather.pressure ?? []), ...(update.weather.pressure ?? [])];
		result.weather.rainfall = [...(result.weather.rainfall ?? []), ...(update.weather.rainfall ?? [])];
		result.weather.trackTemp = [...(result.weather.trackTemp ?? []), ...(update.weather.trackTemp ?? [])];
		result.weather.windDirection = [...(result.weather.windDirection ?? []), ...(update.weather.windDirection ?? [])];
		result.weather.windSpeed = [...(result.weather.windSpeed ?? []), ...(update.weather.windSpeed ?? [])];
	}

	return result;
};

export const createHistoryUpdate = (update: Update, sessionPart: number | undefined) => {
	const updatedHistory: History = {
		gapLeader: getLeaderGap(update, sessionPart),
		gapFront: getFrontGap(update, sessionPart),
		lapTime: getLapTime(update),
		sectors: getSectors(update),
		weather: getWeather(update),
	};

	return updatedHistory;
};

const getLeaderGap = (update: Update, sessionPart: number | undefined): History["gapLeader"] => {
	const lines = update.timingData?.lines;
	if (!lines) return undefined;

	return Object.entries(lines).reduce((acc: LeaderGapHistory, [racingNumber, timingDriver]) => {
		if (!timingDriver) return acc;

		const gapToLeaderString =
			timingDriver.gapToLeader ??
			(timingDriver.stats ? timingDriver.stats[sessionPart ? sessionPart - 1 : 0]?.timeDiffToFastest : undefined) ??
			timingDriver.timeDiffToFastest ??
			undefined;

		const gapToLeader = gapToLeaderString
			? gapToLeaderString.includes("LAP")
				? 0
				: parseFloat(gapToLeaderString)
			: null;
		if (gapToLeader === null) return acc;

		if (acc[racingNumber] === undefined) {
			acc[racingNumber] = [gapToLeader];
		} else {
			acc[racingNumber] = [...acc[racingNumber], gapToLeader];
		}

		return acc;
	}, {});
};

const getFrontGap = (update: Update, sessionPart: number | undefined): History["gapFront"] => {
	const lines = update.timingData?.lines;
	if (!lines) return undefined;

	return Object.entries(lines).reduce((acc: FrontGapHistory, [racingNumber, timingDriver]) => {
		if (!timingDriver) return acc;

		const gapToFrontString =
			timingDriver.intervalToPositionAhead?.value ??
			(timingDriver.stats
				? timingDriver.stats[sessionPart ? sessionPart - 1 : 0]?.timeDifftoPositionAhead
				: undefined) ??
			timingDriver.timeDiffToPositionAhead ??
			undefined;

		const gapToFront = gapToFrontString ? (gapToFrontString.includes("LAP") ? 0 : parseFloat(gapToFrontString)) : null;
		if (!gapToFront) return acc;

		if (acc[racingNumber] === undefined) {
			acc[racingNumber] = [gapToFront];
		} else {
			acc[racingNumber] = [...acc[racingNumber], gapToFront];
		}

		return acc;
	}, {});
};

const getLapTime = (update: Update): History["lapTime"] => {
	const lines = update.timingData?.lines;
	if (!lines) return undefined;

	return Object.entries(lines).reduce((acc: LapTimeHistory, [racingNumber, timingDriver]) => {
		const lapTime = timingDriver?.lastLapTime?.value ? parseLapTime(timingDriver.lastLapTime.value) : null;
		if (!lapTime) return acc;

		if (acc[racingNumber] === undefined) {
			acc[racingNumber] = [lapTime];
		} else {
			acc[racingNumber] = [...acc[racingNumber], lapTime];
		}

		return acc;
	}, {});
};

const getSectors = (update: Update): History["sectors"] => {
	const lines = update.timingData?.lines;
	if (!lines) return undefined;

	return Object.entries(lines).reduce((acc: SectorsHistory, [racingNumber, timingDriver]) => {
		const sectors = timingDriver?.sectors;
		if (!sectors) return acc;

		if (acc[racingNumber] == undefined) {
			acc[racingNumber] = {};
		}

		for (const [key, sector] of Object.entries(sectors)) {
			const sectorTime = sector.value ? parseStringDuration(sector.value) : null;
			if (!sectorTime) continue;

			if (acc[racingNumber][key] == undefined) {
				acc[racingNumber][key] = [sectorTime];
			} else {
				acc[racingNumber][key] = [...acc[racingNumber][key], sectorTime];
			}
		}

		return acc;
	}, {});
};

const getWeather = (update: Update): History["weather"] => {
	const weather = update.weatherData;
	if (!weather) return undefined;

	return {
		trackTemp: weather.trackTemp ? [parseFloat(weather.trackTemp)] : undefined,
		airTemp: weather.airTemp ? [parseFloat(weather.airTemp)] : undefined,
		humidity: weather.humidity ? [parseInt(weather.humidity)] : undefined,
		pressure: weather.pressure ? [parseFloat(weather.pressure)] : undefined,
		rainfall: weather.rainfall ? [!!weather.rainfall] : undefined,
		windDirection: weather.windDirection ? [parseInt(weather.windDirection)] : undefined,
		windSpeed: weather.windSpeed ? [parseInt(weather.windSpeed)] : undefined,
	};
};

const parseStringDuration = (string: string): number => {
	return duration(string).asMilliseconds();
};

const parseLapTime = (string: string): number => {
	const regex = new RegExp(/(\d+):(\d+).(\d+)/gm);
	const groups = regex.exec(string);

	const m = groups?.[0];
	const s = groups?.[1];
	const ms = groups?.[2];

	return duration({
		minutes: m ? parseInt(m) : 0,
		seconds: s ? parseInt(s) : 0,
		milliseconds: ms ? parseInt(ms) : 0,
	}).milliseconds();
};
