"use client";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";
import LeaderBoard from "@/components/LeaderBoard";

import { useSocket } from "@/context/SocketContext";

export default function Page() {
	const { state } = useSocket();

	return (
		<div className="flex flex-col">
			<div className="flex flex-wrap justify-between gap-2 border-b border-zinc-800 bg-zinc-950 p-1 px-2">
				<div className="flex flex-wrap gap-4">
					<SessionInfo session={state?.session} clock={state?.extrapolatedClock} />
					<WeatherInfo weather={state?.weather} />
				</div>

				<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
			</div>

			<LeaderBoard drivers={state?.drivers} />

			<pre>{state?.raceControlMessages?.length}</pre>
			<pre>{state?.weather?.pressure}</pre>
			<pre>{state?.lapCount?.current}</pre>
		</div>
	);
}
