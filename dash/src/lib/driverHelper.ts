export const objectEntries = <T>(obj: { [key: string]: T }): T[] => {
	return Object.entries(obj).map(([k, v]) => v);
};
