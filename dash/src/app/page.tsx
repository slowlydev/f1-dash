"use client";

import { useEffect, useState } from "react";
import { sseSession } from "../lib/sse";
import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";

export default function Page() {
  const [event, setEvent] = useState<any[]>([]);

  return (
    <div>
      <RaceInfo />
      <WeatherInfo />
      <LeaderBoard />
    </div>
  );
}
