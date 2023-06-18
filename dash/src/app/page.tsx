"use client";

import { useEffect, useRef, useState } from "react";

import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";

import { State } from "../types/state.type";

export default function Page() {
  const [state, setState] = useState<null | State>(null);
  const [connected, setConnected] = useState(false);

  const ws = useRef<WebSocket | null>();

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:4000/`);
    console.log("connected");

    socket.onclose = () => setConnected(false);
    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data: State = JSON.parse(event.data);
      setState(data);
    };

    ws.current = socket;
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

      <div className="overflow-x-auto">
        <LeaderBoard drivers={state?.drivers} />
      </div>

      {/* <div className="grid grid-cols-12 gap-4">
        <section className="col-span-9"></section>
        <section className="col-span-3">
          <RaceControlMessages messages={state?.raceControlMessages} />
        </section>
      </div> */}
    </div>
  );
}
