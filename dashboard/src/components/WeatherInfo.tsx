import TemperatureComplication from "./complications/Temperature";
import HumidityComplication from "./complications/Humidity";
import WindSpeedComplication from "./complications/WindSpeed";
import RainComplication from "./complications/Rain";

import { useDataStore } from "@/stores/useDataStore";

export default function DataWeatherInfo() {
	const weather = useDataStore((state) => state.state?.WeatherData);

	return (
		<div className="flex justify-between gap-4">
			{weather ? (
				<>
					<TemperatureComplication value={Math.round(parseFloat(weather.TrackTemp))} label="TRC" />
					<TemperatureComplication value={Math.round(parseFloat(weather.AirTemp))} label="AIR" />
					<HumidityComplication value={parseFloat(weather.Humidity)} />
					<RainComplication rain={weather.Rainfall === "1"} />
					<WindSpeedComplication speed={parseFloat(weather.WindSpeed)} directionDeg={parseInt(weather.WindDirection)} />
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
