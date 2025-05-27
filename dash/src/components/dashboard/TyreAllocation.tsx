import { Driver, TimingAppDataDriver } from "@/types/state.type";
import Image from "next/image";

// these types could be moved to a separate file if reused elsewhere, idk
type Props = {
	drivers: Record<string, Driver>;
	timingData: Record<string, TimingAppDataDriver>;
};

type TyreSet = {
	compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
	used: boolean;
	laps: number;
};

const DEFAULT_ALLOCATION = {
	SOFT: 8,
	MEDIUM: 3,
	HARD: 2,
	INTERMEDIATE: 0,
	WET: 0,
} as const;

export default function TyreAllocation({ drivers, timingData }: Props) {
	if (!drivers || !timingData) {
		console.error("TyreAllocation: Missing drivers or timingData.");
		return null;
	}

	const getTyreAllocation = (driverNumber: string): TyreSet[] => {
		const driverData = timingData[driverNumber];
		if (!driverData?.stints) {
			console.warn(`No stints found for driver ${driverNumber}.`);
			return [];
		}

		const tyreSets: TyreSet[] = [];

		Object.entries(DEFAULT_ALLOCATION).forEach(([compound, count]) => {
			for (let i = 0; i < count; i++) {
				tyreSets.push({
					compound: compound as TyreSet["compound"],
					used: false,
					laps: 0,
				});
			}
		});

		// set used tyres and update lap counts
		driverData.stints.forEach(stint => {
			if (!stint.compound) {
				console.warn(`Stint for driver ${driverNumber} has no compound defined.`);
				return;
			}

			// first unused matching tyre set
			const tyreSet = tyreSets.find(
				t => !t.used && t.compound === stint.compound,
			);

			if (tyreSet && stint.totalLaps !== undefined) {
				tyreSet.used = true;
				tyreSet.laps = stint.totalLaps;
			}
		});

		return tyreSets;
	};

	const noDataAvailable =
		Object.keys(drivers).length === 0 || Object.keys(timingData).length === 0;

	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
				<tr className="border-b border-zinc-700">
					<th className="px-4 py-2 text-left">Driver</th>
					<th className="px-4 py-2 text-center" colSpan={3}>
						Tyre Allocation
					</th>
				</tr>
				</thead>
				<tbody>
					{noDataAvailable ? (
						<tr>
							<td colSpan={3} className="px-4 py-8 text-center text-zinc-500">
								No data available.
							</td>
						</tr>
					) : (
						Object.values(drivers).map(driver => {
							const tyreSets = getTyreAllocation(driver.racingNumber);

							return (
								<tr key={driver.racingNumber} className="border-b border-zinc-800 hover:bg-zinc-900">
									<td className="px-4 py-2 whitespace-nowrap">
										<div className="flex items-center gap-2">
											<div // maybe here we could use the team logo instead? Or the pilot photo?
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: `#${driver.teamColour}` }}
											/>
											<span>{driver.tla}</span>
										</div>
									</td>
									<td className="px-4 py-2">
										<div className="flex items-center gap-4">
											{Object.entries(
												tyreSets.reduce(
													(groups, tyre, index) => {
														if (!groups[tyre.compound]) {
															groups[tyre.compound] = [];
														}
														groups[tyre.compound].push({ ...tyre, originalIndex: index });
														return groups;
													},
													{} as Record<string, (TyreSet & { originalIndex: number })[]>,
												),
											).map(([compound, tyres]) => (
												<div key={compound} className="flex items-center gap-1">
													{tyres.map((tyre) => (
														<div key={`${driver.racingNumber}-${tyre.originalIndex}`} className="group relative">
															<Image
																src={`/tires/${tyre.compound.toLowerCase()}.svg`}
																width={32}
																height={32}
																alt={tyre.compound}
																className={tyre.used ? "grayscale" : ""} // grayscale for used tyres, normal color for unused
															/>
															{tyre.laps > 0 && (
																<span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs">
																	{tyre.laps}
																</span>
															)}

															<div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
																{tyre.compound} - {tyre.used ? `${tyre.laps} laps` : "New"}
															</div>
														</div>
													))}
												</div>
											))}
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}
