import { utc } from "moment";
import type { TimingDataDriver, TimingAppDataDriver } from "@/types/state.type";
import type { SortingCriteria, SortDirection } from "@/stores/useSortingStore";

type PosObject = { position: string };
export const sortPos = (a: PosObject, b: PosObject) => {
	return parseInt(a.position) - parseInt(b.position);
};

type PosObjectQuali = {
	sectors: {
		segments: { status: number }[];
	}[];
};
export const sortQuali = (a: PosObjectQuali, b: PosObjectQuali) => {
	const aPassed = a.sectors.flatMap((sector) => sector.segments).filter((s) => s.status > 0);
	const bPassed = b.sectors.flatMap((sector) => sector.segments).filter((s) => s.status > 0);

	return bPassed.length - aPassed.length;
};

type UtcObject = { utc: string };
export const sortUtc = (a: UtcObject, b: UtcObject) => {
	return utc(b.utc).diff(utc(a.utc));
};

// Convert lap time string (e.g. "1:23.456") to milliseconds for comparison
const lapTimeToMs = (time: string): number => {
	if (!time) return Infinity;
	const [mins, secs] = time.split(":");
	if (!secs) return parseFloat(mins) * 1000;
	return (parseInt(mins) * 60 + parseFloat(secs)) * 1000;
};

export const sortDrivers = (
	criteria: SortingCriteria,
	direction: SortDirection,
	a: TimingDataDriver,
	b: TimingDataDriver,
	appDataA?: TimingAppDataDriver,
	appDataB?: TimingAppDataDriver
): number => {
	let result = 0;
	
	switch (criteria) {
		case "position":
			result = parseInt(a.position) - parseInt(b.position);
			break;

		case "bestLap":
			result = lapTimeToMs(a.bestLapTime.value) - lapTimeToMs(b.bestLapTime.value);
			break;

		case "lastLap":
			result = lapTimeToMs(a.lastLapTime.value) - lapTimeToMs(b.lastLapTime.value);
			break;

		case "pitStatus":
			// Sort pit status: pit out first, then in pit, then on track
			const getPitPriority = (d: TimingDataDriver) => (d.pitOut ? 0 : d.inPit ? 1 : 2);
			result = getPitPriority(a) - getPitPriority(b);
			break;

		case "positionChange":
			// Calculate position changes if grid position data is available
			const aChange = appDataA ? parseInt(appDataA.gridPos) - parseInt(a.position) : 0;
			const bChange = appDataB ? parseInt(appDataB.gridPos) - parseInt(b.position) : 0;
			result = bChange - aChange; // Sort by most positions gained
			break;

		case "sector1":
		case "sector2":
		case "sector3":
			const sectorIndex = parseInt(criteria.slice(-1)) - 1;
			result = lapTimeToMs(a.sectors[sectorIndex]?.value || "") - lapTimeToMs(b.sectors[sectorIndex]?.value || "");
			break;

		case "tyreAge":
			// Sort by tyre age (number of laps on current stint)
			const aAge = appDataA?.stints?.length ? appDataA.stints[appDataA.stints.length - 1].totalLaps || 0 : 0;
			const bAge = appDataB?.stints?.length ? appDataB.stints[appDataB.stints.length - 1].totalLaps || 0 : 0;
			result = bAge - aAge; // Sort by oldest tyres first
			break;
	}

	// Apply direction
	return direction === "asc" ? result : -result;
};
