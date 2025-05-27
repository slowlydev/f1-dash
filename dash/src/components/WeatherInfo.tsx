import TemperatureComplication from "./complications/Temperature";
import HumidityComplication from "./complications/Humidity";
import WindSpeedComplication from "./complications/WindSpeed";
import RainComplication from "./complications/Rain";

import { useDataStore } from "@/stores/useDataStore";

export default function DataWeatherInfo() {
	const weather = useDataStore((state) => state.weatherData);

	return (
		<div className="flex justify-between gap-4">
			{weather ? (
				<>
					<TemperatureComplication value={Math.round(parseFloat(weather.trackTemp))} label="TRC" />
					<TemperatureComplication value={Math.round(parseFloat(weather.airTemp))} label="AIR" />
					<HumidityComplication value={parseFloat(weather.humidity)} />
					<RainComplication rain={weather.rainfall === "1"} />
					<WindSpeedComplication speed={parseFloat(weather.windSpeed)} directionDeg={parseInt(weather.windDirection)} />
				</>
			) : (
				<>
					<Loading />
					<Loading />
					<Loading />
					<Loading />
					<Loading />
				</>
			)}
		</div>
	);
}

function Loading() {
	return <div className="h-[55px] w-[55px] animate-pulse rounded-full bg-zinc-800" />;
}
