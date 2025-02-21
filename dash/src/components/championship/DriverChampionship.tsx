import clsx from "clsx";

import { sortChampionshipPos } from "@/lib/sorting";
import { objectEntries } from "@/lib/driverHelper";

import { useDataStore } from "@/stores/useDataStore";

import ChampionshipDriver from "@/components/championship/ChampionshipDriver";

export default function DriverChampionship() {
	const drivers = useDataStore((state) => state?.driverList);
	const championshipPrediction = useDataStore((state) => state?.championshipPrediction);

	return (
		<div className="flex flex-col p-2">
			<TableHeaders />

			{championshipPrediction?.drivers && drivers && (
				<>
					{objectEntries(championshipPrediction.drivers)
						.sort(sortChampionshipPos)
						.map((championshipDriver, idx) => (
							<ChampionshipDriver
								key={`driver.championship.${idx}`}
								championshipDriver={championshipDriver}
								driver={drivers[championshipDriver.racingNumber]}
							/>
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

const SkeletonDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-zinc-800";

	return (
		<div
			className="h-18 grid place-items-center items-center gap-1 px-2 py-1"
			style={{
				gridTemplateColumns: "5rem 15rem 5rem 5rem",
			}}
		>
			<div className={animateClass} style={{ width: "100%" }} />

			<div className="flex flex-1 flex-col gap-1">
				<div className={clsx(animateClass, "!h-4")} />
				<div className={clsx(animateClass, "!h-3 w-2/3")} />
			</div>
		</div>
	);
};
