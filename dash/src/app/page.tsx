"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Map from "../components/Map";
import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";
import RaceControl from "../components/RaceControl";

import { State } from "../types/state.type";

import { env } from "../env.mjs";
import DelayInput from "../components/DelayInput";

export default function Page() {
  const [state, setState] = useState<null | State>(null);
  const [connected, setConnected] = useState(false);

  const [delay, setDelay] = useState(0);

  const ws = useRef<WebSocket | null>();

  useEffect(() => {
    const socket = new WebSocket(`${env.NEXT_PUBLIC_SERVER_URL}`);

    socket.onclose = () => setConnected(false);
    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data: State = JSON.parse(event.data);
      if (Object.keys(data).length === 0) return;
      setState(data);
    };

    ws.current = socket;

    return () => socket.close();
  }, []);

  return (
    <div className="w-full">
      <RaceInfo
        lapCount={state?.lapCount}
        session={state?.session}
        clock={state?.extrapolatedClock}
        track={state?.trackStatus}
        connected={connected}
      />

      <div className="overflow-x-auto">
        <WeatherInfo weather={state?.weather} />
      </div>

      <div className="overflow-x-auto">
        <LeaderBoard drivers={state?.drivers} />
      </div>

      <div className="overflow-y-auto">
        <RaceControl messages={state?.raceControlMessages} />
      </div>

      <Map
        circuitKey={state?.session?.circuitKey}
        positionBatches={state?.positionBatches}
      />
    </div>
  );
}
