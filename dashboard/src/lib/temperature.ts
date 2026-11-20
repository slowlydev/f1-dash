export type TemperatureUnit = "celsius" | "fahrenheit";

/** Converts a Celsius value from the data feed into the chosen unit, rounded to whole degrees. */
export const convertTemperature = (celsius: number, unit: TemperatureUnit): number =>
	unit === "fahrenheit" ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
