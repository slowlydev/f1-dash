"use client";

import { useState } from "react";

type WeatherData = {
  id: string;
  air_temp: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  time: string;
  track_temp: number;
  wind_direction: number;
  wind_speed: number;
};

export default function WeatherInfo() {
  const [stats, setStats] = useState<WeatherData | null>(null);

  const label = "truncate text-sm font-medium text-gray-500";

  return (
    <dl className="mt-2 grid grid-cols-8">
      <div className="overflow-hidden">
        <dt className={label}>Air Temp</dt>

        <LazyData data={stats?.air_temp} />
      </div>

      <div className="overflow-hidden">
        <dt className={label}>Track Temp</dt>
        <LazyData data={stats?.track_temp} />
      </div>

      <div className="overflow-hidden">
        <dt className={label}>Rainfall</dt>
        <LazyData data={stats?.rainfall} />
      </div>

      <div className="overflow-hidden">
        <dt className={label}>Humidity</dt>
        <LazyData data={stats?.humidity} />
      </div>

      <div className="overflow-hidden">
        <dt className={label}>Wind</dt>
        <LazyData data={stats?.wind_speed} />
      </div>
    </dl>
  );
}

function LazyData({ data }: { data: number | undefined }) {
  return (
    <>
      {data ? (
        <dd className="mt-1 text-3xl font-semibold text-white">{data}°</dd>
      ) : (
        <dd
          className="mt-1 h-8 animate-pulse rounded-md bg-gray-700 font-semibold"
          style={{ width: "70%" }}
        ></dd>
      )}
    </>
  );
}
