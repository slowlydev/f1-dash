import { utc } from "moment";

export const utcToLocalMs = (utcDateString: string): number => {
	return utc(utcDateString).local().valueOf();
};
