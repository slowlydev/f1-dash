export const getWindDirection = (deg: number) => {
	const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	return directions[Math.floor(deg / 45) % 8];
};
