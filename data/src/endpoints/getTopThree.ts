import { F1TopThree } from "../f1-types/formula1.type";
import { TopThreeDriver } from "../types/archive.type";

export const getTopThree = async (path: string): Promise<F1TopThree> => {
	const req = await fetch(`https://livetiming.formula1.com/static/${path}TopThree.json`, {
		method: "GET",
		headers: {
			"User-Agent": "F1-Data-Server",
			"Content-Type": "application/json",
		},
	});

	const text = await req.text();
	const json: F1TopThree = JSON.parse(text.trim()); // TODO trim() is a bun workaround, remove when fixed

	return json;
};

export const translateTopThree = (topThree: F1TopThree): TopThreeDriver[] => {
	return topThree.Lines.map((driver): TopThreeDriver => {
		return {
			nr: driver.RacingNumber,
			broadcastName: driver.BroadcastName,
			fullName: driver.FullName,
			short: driver.Tla,
			teamName: driver.Team,
			teamColor: driver.TeamColour,
			position: driver.Position,
			gapToFront: driver.DiffToAhead,
			gapToLeader: driver.DiffToLeader,
			lap: driver.LapState,
		};
	});
};
