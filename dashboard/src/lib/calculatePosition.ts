import type { TimingData } from "@/types/state.type";

import { sortPos } from "@/lib/sorting";

export const calculatePosition = (seconds: number, driverNr: string, timingData: TimingData): number | null => {
	const driverTiming = timingData.Lines[driverNr];

	if (!driverTiming) {
		return null;
	}

	const currentPos = parseInt(driverTiming.Position);

	// get all drivers that are behind the current driver
	// sort them by their position
	const drivers = Object.values(timingData.Lines)
		.filter((driver) => parseInt(driver.Position) > currentPos)
		.sort(sortPos);

	// accumulate the time they are behind each other
	// until the accumulated time is greater than the given time
	let accGap = 0;
	let pos = currentPos;

	for (const driver of drivers) {
		const gap = parseFloat(driver.GapToLeader);
		accGap += gap;

		if (accGap > seconds) {
			break;
		}

		pos++;
	}

	return pos;
};
