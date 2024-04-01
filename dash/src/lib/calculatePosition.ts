import { type TimingData } from "@/types/state.type";
import { objectEntries } from "./driverHelper";
import { sortPos } from "./sorting/sortPos";

export const calculatePosition = (seconds: number, driverNr: string, timingData: TimingData): number | null => {
	const driverTiming = timingData.lines[driverNr];

	if (!driverTiming) {
		return null;
	}

	const currentPos = parseInt(driverTiming.position);

	// get all drivers that are behind the current driver
	// sort them by their position
	const drivers = objectEntries(timingData.lines)
		.filter((driver) => parseInt(driver.position) > currentPos)
		.sort(sortPos);

	// accumulate the time they are behind each other
	// until the accumulated time is greater than the given time
	let accGap = 0;
	let pos = currentPos;

	for (const driver of drivers) {
		const gap = parseFloat(driver.gapToLeader);
		accGap += gap;

		if (accGap > seconds) {
			break;
		}

		pos++;
	}

	return pos;
};
