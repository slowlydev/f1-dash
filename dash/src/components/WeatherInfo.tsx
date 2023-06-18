import { getWindDirection } from "../lib/getWindDirection";
import { Weather } from "../types/weather.type";

type Props = {
  weather: Weather | undefined;
};

export default function DataWeatherInfo({ weather }: Props) {
  const label = "truncate text-sm font-medium text-gray-500";

  const handleRain = (rainfall: number | undefined) => {
    if (rainfall === 1) return "Yes";
    if (rainfall === 0) return "No";
    return undefined;
  };

  return (
    <dl
      className="mt-2 grid gap-4"
      style={{
        gridTemplateColumns: "5rem 7rem 5rem 4rem 8rem 7rem auto",
      }}
    >
      <div>
        <dt className={label}>Air Temp</dt>
        <LazyData data={weather?.air_temp} unit="°" />
      </div>

      <div>
        <dt className={label}>Track Temp</dt>
        <LazyData data={weather?.track_temp} unit="°C" />
      </div>

      <div>
        <dt className={label}>Humidity</dt>
        <LazyData data={weather?.humidity} unit="%" />
      </div>

      <div>
        <dt className={label}>Rainfall</dt>
        <LazyData data={handleRain(weather?.rainfall)} />
      </div>

      <div>
        <dt className={label}>Wind Speed</dt>
        <LazyData data={weather?.wind_speed} unit=" km/h" />
      </div>

      <div>
        <dt className={label}>Wind Direction</dt>
        <LazyData data={getWindDirection(weather?.wind_direction ?? 0)} />
      </div>
    </dl>
  );
}

function LazyData({
  data,
  unit,
}: {
  data: string | number | undefined;
  unit?: string;
}) {
  return (
    <>
      {data !== undefined ? (
        <dd className="mt-1 whitespace-nowrap text-3xl font-semibold text-white">
          {data}
          {unit}
        </dd>
      ) : (
        <dd
          className="mt-1 h-8 animate-pulse rounded-md bg-gray-700 font-semibold"
          style={{ width: "70%" }}
        ></dd>
      )}
    </>
  );
}
