import { Weather } from "../types/weather.type";

type Props = {
  weather: Weather | undefined;
};

export default function DataWeatherInfo({ weather }: Props) {
  const label = "truncate text-sm font-medium text-gray-500";

  return (
    <dl className="mt-2 grid grid-cols-10 gap-1">
      <div className="col-span-2">
        <dt className={label}>Air Temp</dt>
        <LazyData data={weather?.air_temp} unit="°" />
      </div>

      <div className="col-span-2">
        <dt className={label}>Track Temp</dt>
        <LazyData data={weather?.track_temp} unit="°" />
      </div>

      <div className="col-span-2">
        <dt className={label}>Humidity</dt>
        <LazyData data={weather?.humidity} unit="%" />
      </div>

      <div className="col-span-2">
        <dt className={label}>Rainfall</dt>
        <LazyData
          data={
            weather?.rainfall === 1
              ? "Yes"
              : weather?.rainfall === 0
              ? "No"
              : undefined
          }
          unit=""
        />
      </div>

      <div className="col-span-2">
        <dt className={label}>Wind</dt>
        <LazyData data={weather?.wind_speed} unit=" km/h" />
      </div>
    </dl>
  );
}

function LazyData({
  data,
  unit,
}: {
  data: string | number | undefined;
  unit: string;
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
