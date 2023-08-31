"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Map from "../components/Map";
import TrackInfo from "../components/TrackInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";
import RaceControl from "../components/RaceControl";
import TeamRadios from "../components/TeamRadios";

import { State } from "../types/state.type";

import { env } from "../env.mjs";
import Footer from "../components/Footer";
import DelayInput from "../components/DelayInput";
import SessionInfo from "../components/SessionInfo";
import ConnectionStatus from "../components/ConnectionStatus";
import HelpButton from "../components/HelpButton";

type Timeout = NodeJS.Timeout;

export default function Page() {
  const [state, setState] = useState<null | State>(null);
  const [connected, setConnected] = useState(false);

  const [delay, setDelay] = useState<number>(0);
  const [timeouts, setTimeouts] = useState<Timeout[]>([]);

  const ws = useRef<WebSocket | null>();

  useEffect(() => {
    timeouts.map(clearTimeout);
    setTimeouts([]);

    const socket = new WebSocket(`${env.NEXT_PUBLIC_SERVER_URL}`);

    socket.onclose = () => setConnected(false);
    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data: State = JSON.parse(event.data);

      if (Object.keys(data).length === 0) return;

      if (delay > 0) {
        const newTimeout = setTimeout(() => setState(data), delay * 1000);
        setTimeouts((otherTimeouts) => [...otherTimeouts, newTimeout]);
      } else {
        setState(data);
      }
    };

    ws.current = socket;

    return () => socket.close();
  }, [delay]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-1 items-center justify-between gap-5">
          <SessionInfo
            session={state?.session}
            clock={state?.extrapolatedClock}
          />

          <DelayInput setDebouncedDelay={setDelay} />

          <ConnectionStatus connected={connected} defaultHidden={false} />

          <HelpButton defaultHidden={false} />
        </div>

        <TrackInfo
          lapCount={state?.lapCount}
          track={state?.trackStatus}
          connected={connected}
        />
      </div>

      <div className="overflow-x-auto">
        <WeatherInfo weather={state?.weather} />
      </div>

      <div
        className={clsx(
          "flex flex-col divide-y divide-gray-500",
          "3xl:flex-row 3xl:divide-x 3xl:divide-y-0"
        )}
      >
        <div
          className={clsx(
            "flex flex-col divide-y divide-gray-500",
            "xl:flex-row xl:divide-x xl:divide-y-0"
          )}
        >
          <div
            className={clsx(
              "mb-2 overflow-x-auto",
              "xl:mr-2 xl:flex-1 xl:overflow-visible"
            )}
          >
            <LeaderBoard drivers={state?.drivers} />
          </div>
          <div
            className={clsx(
              "flex flex-col divide-y divide-gray-500",
              "sm:flex-row sm:divide-x sm:divide-y-0",
              "xl:flex-1 xl:flex-col xl:divide-x-0 xl:divide-y xl:pl-2"
            )}
          >
            <div
              className={clsx(
                "my-2 h-96 overflow-y-auto",
                "sm:mr-2 sm:w-1/2",
                "xl:auto xl:mr-0 xl:w-auto xl:flex-grow"
              )}
            >
              <RaceControl messages={state?.raceControlMessages} />
            </div>

            <div
              className={clsx(
                "my-2 h-96 overflow-y-auto",
                "sm:w-1/2 sm:pl-2",
                "xl:auto xl:w-auto xl:flex-grow xl:pl-0 xl:pt-2"
              )}
            >
              <TeamRadios teamRadios={state?.teamRadios} />
            </div>
          </div>
        </div>

        <div
          className={"max-h-screen xl:mt-2 3xl:ml-2 3xl:w-1/2 3xl:flex-grow"}
        >
          <Map
            circuitKey={state?.session?.circuitKey}
            positionBatches={state?.positionBatches}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
