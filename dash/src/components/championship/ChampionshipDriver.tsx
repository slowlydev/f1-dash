import type { ChampionshipDriver, Driver } from "@/types/state.type";
import DriverTag from "../driver/DriverTag";

type Props = {
	driver: Driver | undefined;
	championshipDriver: ChampionshipDriver;
};

export default function ChampionshipDriver({ driver, championshipDriver }: Props) {
	if (!driver) return null;

	return (
		<div className="grid items-center gap-2 py-2" style={{ gridTemplateColumns: "5rem 15rem 5rem 5rem" }}>
			<DriverTag
				className="!min-w-full"
				position={championshipDriver.currentPosition}
				teamColor={driver.teamColour}
				short={driver.tla}
			/>

			<div className="leading-none">
				<p>{driver.fullName}</p>
				<p>{driver.teamName}</p>
			</div>

			<div>
				<p>{championshipDriver.currentPoints}</p>
			</div>

			<div>
				<p>{championshipDriver.predictedPoints}</p>
			</div>
		</div>
	);
}
