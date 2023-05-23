"use client";

import { useEffect, useState } from "react";
import { sseSession } from "../lib/sse";

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

  useEffect(() => {
    const weather = sseSession("weather");

    weather.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setStats(data);
    };

    return () => {
      weather.close();
    };
  }, []);

  if (!stats) return <p>Failed to load</p>;

  return (
    <dl className="mt-5 grid grid-cols-8">
      <div className="overflow-hidden px-4">
        <dt className="truncate text-sm font-medium text-gray-500">Air Temp</dt>
        <dd className="mt-1 text-3xl font-semibold text-white">
          {stats.air_temp}°
        </dd>
      </div>

      <div className="overflow-hidden px-4">
        <dt className="truncate text-sm font-medium text-gray-500">
          Track Temp
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-white">
          {stats.track_temp}°
        </dd>
      </div>

      <div className="overflow-hidden px-4">
        <dt className="truncate text-sm font-medium text-gray-500">Rainfall</dt>
        <dd className="mt-1 text-3xl font-semibold text-white">
          {stats.rainfall}
        </dd>
      </div>

      <div className="overflow-hidden px-4">
        <dt className="truncate text-sm font-medium text-gray-500">Humidity</dt>
        <dd className="mt-1 text-3xl font-semibold text-white">
          {stats.humidity}
        </dd>
      </div>

      <div className="overflow-hidden px-4">
        <dt className="truncate text-sm font-medium text-gray-500">Wind</dt>
        <dd className="mt-1 text-3xl font-semibold text-white">
          {stats.wind_speed} km/h
        </dd>
      </div>
    </dl>
  );
}
