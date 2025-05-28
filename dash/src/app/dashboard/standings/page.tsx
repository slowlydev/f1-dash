"use client";

import { useDataStore } from "@/stores/useDataStore";

import NumberDiff from "@/components/NumberDiff";
import Image from "next/image";

export default function Standings() {
	const driverStandings = useDataStore((state) => state?.championshipPrediction?.drivers);
	const teamStandings = useDataStore((state) => state?.championshipPrediction?.teams);

	const drivers = useDataStore((state) => state.driverList);

	const isRace = useDataStore((state) => state.sessionInfo?.type === "Race");

	if (!isRace) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center">
				<p>championship standings unavailable</p>
				<p className="text-sm text-zinc-500">currently only available during a race</p>
			</div>
		);
	}

	return (
		<div className="grid h-full grid-cols-1 divide-y divide-zinc-800 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
			<div className="h-full p-4">
				<h2 className="text-xl">Driver Championship Standings</h2>

				<div className="divide flex flex-col divide-y divide-zinc-800">
					{!driverStandings &&
						new Array(20).fill("").map((_, index) => <SkeletonItem key={`driver.loading.${index}`} />)}

					{driverStandings &&
						drivers &&
						Object.values(driverStandings)
							.sort((a, b) => a.predictedPosition - b.predictedPosition)
							.map((driver) => {
								const driverDetails = drivers[driver.racingNumber];

								if (!driverDetails) {
									return null;
								}

								return (
									<div
										className="grid p-2"
										style={{
											gridTemplateColumns: "2rem 2rem auto 4rem 4rem",
										}}
										key={driver.racingNumber}
									>
										<NumberDiff old={driver.currentPosition} current={driver.predictedPosition} />
										<p>{driver.predictedPosition}</p>

										<p>
											{driverDetails.firstName} {driverDetails.lastName}
										</p>

										<p>{driver.predictedPoints}</p>

										<NumberDiff old={driver.predictedPoints} current={driver.currentPoints} />
									</div>
								);
							})}
				</div>
			</div>

			<div className="h-full p-4">
				<h2 className="text-xl">Team Championship Standings</h2>

				<div className="divide flex flex-col divide-y divide-zinc-800">
					{!teamStandings && new Array(10).fill("").map((_, index) => <SkeletonItem key={`team.loading.${index}`} />)}

					{teamStandings &&
						Object.values(teamStandings)
							.sort((a, b) => a.predictedPosition - b.predictedPosition)
							.map((team) => (
								<div
									className="grid p-2"
									style={{
										gridTemplateColumns: "2rem 2rem 2rem auto 4rem 4rem",
									}}
									key={team.teamName}
								>
									<NumberDiff old={team.currentPosition} current={team.predictedPosition} />
									<p>{team.predictedPosition}</p>

									<Image
										src={`/team-logos/${team.teamName.replaceAll(" ", "-").toLowerCase()}.${"svg"}`}
										alt={team.teamName}
										width={24}
										height={24}
										className="overflow-hidden rounded-lg"
									/>

									<p>{team.teamName}</p>

									<p>{team.predictedPoints}</p>

									<NumberDiff old={team.predictedPoints} current={team.currentPoints} />
								</div>
							))}
				</div>
			</div>
		</div>
	);
}

const SkeletonItem = () => {
	return (
		<div
			className="grid gap-2 p-2"
			style={{
				gridTemplateColumns: "2rem 2rem auto 4rem 4rem 4rem",
			}}
		>
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-16 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-8 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-8 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
		</div>
	);
};
