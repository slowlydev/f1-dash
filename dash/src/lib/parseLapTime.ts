export const parseLapTime = (laptime: string): number => {
	const [minutes, secondsAndMiliseconds]: (string | undefined)[] = laptime.split(":");

	const [seconds, miliseconds] = secondsAndMiliseconds.split(".");

	const minutesInSeconds = parseInt(minutes) * 60;
	const milisecondInSeconds = parseInt(miliseconds) / 60;

	return minutesInSeconds + parseInt(seconds) + milisecondInSeconds;
};
