/**
 * Welcome to the most scuffed time/date conversion.
 *
 * We assume the offset has this patter: HH:mm:ss
 *
 * We also assume that the utc date provided does not have a Z to indicate utc, because why not F1
 *
 * We extract the h m s from our string and parse to ints/numbers
 * We individually update our original date with hours, minutes and seconds.
 * *
 * @param utc
 * @param offset
 * @returns ISO-8601 string
 */
export const toTrackTime = (utc: string, offset: string): string => {
	const date = new Date(utc);

	const [hours, minutes, seconds]: (number | undefined)[] = offset.split(":").map((unit) => parseInt(unit));

	if (!hours || !minutes || !seconds) return date.toISOString();

	date.setUTCHours(date.getUTCHours() + hours);
	date.setUTCMinutes(date.getUTCMinutes() + minutes);
	date.setUTCSeconds(date.getUTCSeconds() + seconds);

	return date.toISOString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttledDebounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number,
): ((...args: Parameters<typeof func>) => void) => {
	let timeout: Timer;
	let lastCalled = 0;
	let lastExecuted = 0;
	return (...args) => {
		const now = Date.now();
		if (timeout) {
			clearTimeout(timeout);
		}
		if (now - lastCalled > delay) {
			func(...args);
			lastCalled = now;
			lastExecuted = now;
		} else {
			lastCalled = now;
			const nextCall = delay - (now - lastExecuted);
			timeout = setTimeout(() => {
				func(...args);
				lastExecuted = now + nextCall;
			}, nextCall);
		}
	};
};
