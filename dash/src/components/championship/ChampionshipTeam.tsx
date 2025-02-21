import type { ChampionshipTeam } from "@/types/state.type";

type Props = {
	team: ChampionshipTeam;
};

export default function ChampionshipTeam({ team }: Props) {
	return (
		<div className="grid items-center gap-2 py-2" style={{ gridTemplateColumns: "5rem 15rem 5rem 5rem" }}>
			<div className="leading-none">
				<p>{team.teamName}</p>
			</div>

			<div>
				<p>{team.currentPoints}</p>
			</div>

			<div>
				<p>{team.predictedPoints}</p>
			</div>
		</div>
	);
}
