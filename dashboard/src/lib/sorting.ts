import { utc } from "moment";

type PosObject = { Position: string };
export const sortPos = (a: PosObject, b: PosObject) => {
	return parseInt(a.Position) - parseInt(b.Position);
};

type PosObjectQuali = {
	Sectors: {
		Segments: { Status: number }[];
	}[];
};
export const sortQuali = (a: PosObjectQuali, b: PosObjectQuali) => {
	const aPassed = a.Sectors.flatMap((sector) => sector.Segments).filter((s) => s.Status > 0);
	const bPassed = b.Sectors.flatMap((sector) => sector.Segments).filter((s) => s.Status > 0);

	return bPassed.length - aPassed.length;
};

type UtcObject = { Utc: string };
export const sortUtc = (a: UtcObject, b: UtcObject) => {
	return utc(b.Utc).diff(utc(a.Utc));
};
