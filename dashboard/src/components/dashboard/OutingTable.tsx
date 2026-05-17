"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { sortPos } from "@/lib/sorting";

import DriverTag from "@/components/driver/DriverTag";
import DriverHistoryTires from "@/components/driver/DriverHistoryTires";

export default function OutingTable() {
	const drivers = useDataStore(({ state }) => state?.DriverList);
	const driversTiming = useDataStore(({ state }) => state?.TimingData);
	const appDriversTiming = useDataStore(({ state }) => state?.TimingAppData);

	const oledMode = useSettingsStore((state) => state.oledMode);
	const timingLines = driversTiming ? Object.values(driversTiming.Lines).sort(sortPos) : [];
	const splitIndex = Math.ceil(timingLines.length / 2);
	const timingColumns = [timingLines.slice(0, splitIndex), timingLines.slice(splitIndex)];

	return (
		<div className="flex w-full flex-col">
			<div
				className="grid items-center gap-2 p-1 px-2 text-sm font-medium text-zinc-500"
				style={{ gridTemplateColumns: "5.5rem auto" }}
			>
				<p>Driver</p>
				<p>Tire History / Outings</p>
			</div>

			{(!drivers || !driversTiming) &&
				new Array(20).fill("").map((_, index) => <SkeletonRow key={`outing.loading.${index}`} />)}

			<LayoutGroup id="outings">
				{drivers && driversTiming && (
					<AnimatePresence mode="popLayout">
						<div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
							{timingColumns.map((column, columnIndex) => (
								<div key={`outing.column.${columnIndex}`} className="flex flex-col divide-y divide-zinc-800/50">
									{column.map((timingDriver, index) => {
										const driver = drivers[timingDriver.RacingNumber];
										const appTiming = appDriversTiming?.Lines[timingDriver.RacingNumber];
										const position = columnIndex * splitIndex + index + 1;

										return (
											<motion.div
												key={`outing.row.${timingDriver.RacingNumber}`}
												layout
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className={clsx("grid items-center gap-4 p-1 px-2 transition-colors hover:bg-zinc-900/40", {
													"bg-black": oledMode,
													"bg-zinc-950/20": !oledMode,
												})}
												style={{ gridTemplateColumns: "5.5rem auto" }}
											>
												<DriverTag
													className="min-w-full!"
													short={driver.Tla}
													teamColor={driver.TeamColour}
													position={position}
												/>
												<div className="no-scrollbar overflow-x-auto">
													<DriverHistoryTires stints={appTiming?.Stints} />
												</div>
											</motion.div>
										);
									})}
								</div>
							))}
						</div>
					</AnimatePresence>
				)}
			</LayoutGroup>
		</div>
	);
}

function SkeletonRow() {
	return (
		<div
			className="grid items-center gap-4 border-b border-zinc-800/30 px-4 py-3"
			style={{ gridTemplateColumns: "7rem 1fr" }}
		>
			<div className="h-10 animate-pulse rounded-lg bg-zinc-800" />
			<div className="flex gap-3">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex flex-col items-center gap-2">
						<div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800" />
						<div className="h-3 w-6 animate-pulse rounded bg-zinc-800" />
					</div>
				))}
			</div>
		</div>
	);
}
