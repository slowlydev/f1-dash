import { Weather } from "../types/weather.type";

import TemperatureComplication from "./complications/Temperature";
import HumidityComplication from "./complications/Humidity";
import WindSpeedComplication from "./complications/WindSpeed";
import RainComplication from "./complications/Rain";

type Props = {
	weather: Weather | undefined;
};

export default function DataWeatherInfo({ weather }: Props) {
	return (
		<div className="flex gap-2">
			{weather ? (
				<>
					<TemperatureComplication value={Math.round(weather.track_temp)} label="TRC" />
					<TemperatureComplication value={Math.round(weather.air_temp)} label="AIR" />
					<HumidityComplication value={weather.humidity} />
					<RainComplication rain={!weather.rainfall} />
					<WindSpeedComplication speed={weather.wind_speed} directionDeg={weather.wind_direction} />
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
	return <div className="h-[55px] w-[55px] animate-pulse rounded-full bg-gray-700" />;
}
