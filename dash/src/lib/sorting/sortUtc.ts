import { utc } from "moment";

type UtcObject = { utc: string };

export const sortUtc = (a: UtcObject, b: UtcObject) => {
	return utc(b.utc).diff(utc(a.utc));
};
