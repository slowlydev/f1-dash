"use client";

import RaceInfo from "../components/RaceInfo";
import WeatherInfo from "../components/WeatherInfo";
import LeaderBoard from "../components/LeaderBoard";
import RaceControlMessages from "../components/RaceControlMessages";

export default function Page() {
  return (
    <div>
      <RaceInfo />
      <WeatherInfo />
      <LeaderBoard />

      {/* <div className="grid grid-cols-12 gap-4">
        <section className="col-span-9"></section>
        <section className="col-span-3">
          <RaceControlMessages />
        </section>
      </div> */}
    </div>
  );
}
