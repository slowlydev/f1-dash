import { utc } from "moment";

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
