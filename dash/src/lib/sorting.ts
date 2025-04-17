import { utc } from "moment";
import type { TimingDataDriver, TimingAppDataDriver } from "@/types/state.type";
import type { SortingCriteria } from "@/stores/useSortingStore";

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
	a: TimingDataDriver,
	b: TimingDataDriver,
	appDataA?: TimingAppDataDriver,
	appDataB?: TimingAppDataDriver
): number => {
	switch (criteria) {
		case "position":
			return parseInt(a.position) - parseInt(b.position);

		case "bestLap":
			return lapTimeToMs(a.bestLapTime.value) - lapTimeToMs(b.bestLapTime.value);

		case "lastLap":
			return lapTimeToMs(a.lastLapTime.value) - lapTimeToMs(b.lastLapTime.value);

		case "pitStatus":
			const getPitPriority = (d: TimingDataDriver) => (d.pitOut ? 0 : d.inPit ? 1 : 2);
			return getPitPriority(a) - getPitPriority(b);

		case "positionChange":
			const aChange = appDataA ? parseInt(appDataA.gridPos) - parseInt(a.position) : 0;
			const bChange = appDataB ? parseInt(appDataB.gridPos) - parseInt(b.position) : 0;
			return bChange - aChange; // Sort by most positions gained

		case "sector1":
		case "sector2":
		case "sector3":
			const sectorIndex = parseInt(criteria.slice(-1)) - 1;
			return lapTimeToMs(a.sectors[sectorIndex]?.value || "") - lapTimeToMs(b.sectors[sectorIndex]?.value || "");

		case "tyreAge":
			const aAge = appDataA?.stints?.length ? appDataA.stints[appDataA.stints.length - 1].totalLaps || 0 : 0;
			const bAge = appDataB?.stints?.length ? appDataB.stints[appDataB.stints.length - 1].totalLaps || 0 : 0;
			return bAge - aAge; // Sort by oldest tyres first

		default:
			return 0;
	}
};
