"use client";

import { useEffect, useRef, useState } from "react";

// import Map from "../components/Map";
import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";
// import RaceControlMessages from "../components/RaceControlMessages";

import { State } from "../types/state.type";

import { env } from "../env.mjs";

export default function Page() {
  const [state, setState] = useState<null | State>(null);
  const [connected, setConnected] = useState(false);

  const ws = useRef<WebSocket | null>();

  useEffect(() => {
    const socket = new WebSocket(`${env.NEXT_PUBLIC_SERVER_URL}`);
    console.log("connected");

    socket.onclose = () => setConnected(false);
    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data: State = JSON.parse(event.data);
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
      />

      <div className="overflow-x-auto">
        <WeatherInfo weather={state?.weather} />
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        <div className="overflow-x-auto">
          <LeaderBoard drivers={state?.drivers} />
        </div>

        {/* <div className="min-w-fit flex-1">
          <Map
            circuitKey={state?.session?.circuitKey}
            positionBatches={state?.positionBatches}
          />
        </div> */}
      </div>

      {/* <RaceControlMessages messages={state?.raceControlMessages} /> */}
    </div>
  );
}
