export const toTrackTime = (utc: string, offset: string) => {
	const utcDate = new Date(utc);

	const [hours, minutes, seconds]: (number | undefined)[] = offset.split(":").map((unit) => parseInt(unit));

	const trackTime = new Date();
	trackTime.setHours(utcDate.getHours() + hours);
	trackTime.setMinutes(utcDate.getMinutes() + minutes);
	trackTime.setSeconds(utcDate.getSeconds() + seconds);

	return trackTime.toISOString();
};
