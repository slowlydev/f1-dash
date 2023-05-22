"use client";

import { useEffect, useState } from "react";
import { sseSession } from "../lib/sse";
import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";
import RaceControlMessages from "../components/RaceControlMessages";
import { RaceControlMessage } from "../types/race-control-message.type";

const messages: RaceControlMessage[] = [
  {
    message: "Green Flag",
    time: "2023-05-07T19:31:25.372Z",
    id: "a1131838-0390-40c4-b84a-0bce38bbe522",
    type: "FLAG",
  },
  {
    message: "Green Flag",
    time: "2023-05-07T19:31:25.372Z",
    id: "a1131838-0390-40c4-b84a-0bce38bbe522",
    type: "FLAG",
  },
  {
    message: "Green Flag",
    time: "2023-05-07T19:31:25.372Z",
    id: "a1131838-0390-40c4-b84a-0bce38bbe522",
    type: "FLAG",
  },
  {
    message: "Green Flag",
    time: "2023-05-07T19:31:25.372Z",
    id: "a1131838-0390-40c4-b84a-0bce38bbe522",
    type: "FLAG",
  },
];

export default function Page() {
  return (
    <div>
      <RaceInfo />
      <WeatherInfo />

      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-9">
          <LeaderBoard />
        </section>
        <section className="col-span-3">
          <RaceControlMessages messages={messages} />
        </section>
      </div>
    </div>
  );
}
