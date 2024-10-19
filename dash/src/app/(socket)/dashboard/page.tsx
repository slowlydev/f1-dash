"use client";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import LeaderBoard from "@/components/LeaderBoard";
import TrackInfo from "@/components/TrackInfo";

export default function Page() {
	return (
		<div className="flex w-full flex-col">
			<div className="hidden grid-cols-3 overflow-hidden border-b border-zinc-800 p-1.5 md:grid">
				<div className="flex items-center">
					<SessionInfo />
				</div>

				<div className="flex items-center">
					<WeatherInfo />
				</div>

				<div className="flex flex-row-reverse items-center">
					<TrackInfo />
				</div>
			</div>

			<div>
				<LeaderBoard />

				<div></div>
			</div>
		</div>
	);
}
