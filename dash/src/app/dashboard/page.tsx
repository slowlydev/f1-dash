"use client";

import LeaderBoard from "@/components/LeaderBoard";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import TrackMap from "@/components/TrackMap";
import TrackViolations from "@/components/TrackViolations";

import { Grid, type GridComponentMap } from "@/lib/Grid";
import { useGridStore } from "@/stores/useGridStore";

const GRID_MAP: GridComponentMap = {
	leaderboard: LeaderBoard,
	racecontrol: RaceControl,
	teamradios: TeamRadios,
	trackmap: TrackMap,
	trackviolations: TrackViolations,
};

export default function Page() {
	const stack = useGridStore((state) => state.stack);

	return (
		<div className="p-2">
			<Grid map={GRID_MAP} stack={stack} />
		</div>
	);
}
