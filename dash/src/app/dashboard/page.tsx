"use client";

import DriverChampionship from "@/components/championship/DriverChampionship";
import TeamChampionship from "@/components/championship/TeamChampionship";
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
	driverChamptionship: DriverChampionship,
	teamChampionship: TeamChampionship,
};

export default function Page() {
	const stack = useGridStore((state) => state.stack);

	return (
		<div className="">
			<Grid map={GRID_MAP} stack={stack} />
		</div>
	);
}
