export const utcToLocalMs = (utcDateString: string): number => {
	const utcDate = new Date(utcDateString);
	const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
	return localDate.getMilliseconds();
};
