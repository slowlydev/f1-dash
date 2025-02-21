import clsx from "clsx";

import { sortChampionshipPos } from "@/lib/sorting";

import { objectEntries } from "@/lib/driverHelper";
import { useDataStore } from "@/stores/useDataStore";
import ChampionshipTeam from "@/components/championship/ChampionshipTeam";

export default function TeamChampionship() {
	const championshipPrediction = useDataStore((state) => state?.championshipPrediction);

	return (
		<div className="flex flex-col p-2">
			<TableHeaders />

			{championshipPrediction?.teams && (
				<>
					{objectEntries(championshipPrediction.teams)
						.sort(sortChampionshipPos)
						.map((team, idx) => (
							<ChampionshipTeam key={`team.championship.${idx}`} team={team} />
						))}
				</>
			)}
		</div>
	);
}

const TableHeaders = () => {
	return (
		<div
			className="grid place-items-start gap-2 text-sm font-medium text-zinc-500"
			style={{
				gridTemplateColumns: "5rem 15rem 5rem 5.5rem",
			}}
		>
			<p>Position</p>
			<p>Name / Team</p>
			<p>Current</p>
			<p>Predicted</p>
		</div>
	);
};
