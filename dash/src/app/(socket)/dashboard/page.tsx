"use client";

import LeaderBoard from "@/components/LeaderBoard";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import TrackMap from "@/components/TrackMap";

export default function Page() {
	return (
		<div className="flex w-full gap-2">
			<LeaderBoard />

			<div className="flex flex-1 flex-col gap-2">
				<div className="rounded-lg border border-zinc-900 bg-zinc-950 p-2">
					<TrackMap />
				</div>

				<div className="grid h-96 flex-1 grid-cols-2 gap-2">
					<div className="rounded-lg border border-zinc-900 bg-zinc-950 p-2">{/* <RaceControl /> */}</div>

					<div className="rounded-lg border border-zinc-900 bg-zinc-950 p-2">{/* <TeamRadios /> */}</div>
				</div>
			</div>
		</div>
	);
}
