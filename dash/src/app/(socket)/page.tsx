"use client";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";

import { useSocket } from "@/context/SocketContext";

export default function Page() {
	const { state } = useSocket();

	return (
		<div className="flex flex-col">
			{/* <div className="flex gap-2 border-b border-zinc-800 bg-zinc-950 p-1 px-2">
				<SessionInfo session={state?.session} clock={state?.extrapolatedClock} />
				<WeatherInfo weather={state?.weather} />
				<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
			</div> */}
		</div>
	);
}
