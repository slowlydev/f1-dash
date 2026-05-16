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

	return (
		<div className="flex w-full flex-col">
			<div
				className="grid items-center gap-4 border-b border-zinc-800 bg-zinc-900/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500"
				style={{ gridTemplateColumns: "7rem 1fr" }}
			>
				<p>Driver</p>
				<p>Tire History / Outings</p>
			</div>

			{(!drivers || !driversTiming) &&
				new Array(20).fill("").map((_, index) => <SkeletonRow key={`outing.loading.${index}`} />)}

			<LayoutGroup id="outings">
				<div className="flex flex-col divide-y divide-zinc-800/50">
					{drivers && driversTiming && (
						<AnimatePresence mode="popLayout">
							{Object.values(driversTiming.Lines)
								.sort(sortPos)
								.map((timingDriver, index) => {
									const driver = drivers[timingDriver.RacingNumber];
									const appTiming = appDriversTiming?.Lines[timingDriver.RacingNumber];

									return (
										<motion.div
											key={`outing.row.${timingDriver.RacingNumber}`}
											layout
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className={clsx("grid items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-900/40", {
												"bg-black": oledMode,
												"bg-zinc-950/20": !oledMode,
											})}
											style={{ gridTemplateColumns: "7rem 1fr" }}
										>
											<DriverTag
												className="min-w-full!"
												short={driver.Tla}
												teamColor={driver.TeamColour}
												position={index + 1}
											/>
											<div className="no-scrollbar overflow-x-auto">
												<DriverHistoryTires stints={appTiming?.Stints} />
											</div>
										</motion.div>
									);
								})}
						</AnimatePresence>
					)}
				</div>
			</LayoutGroup>
		</div>
	);
}

function SkeletonRow() {
	return (
		<div className="grid items-center gap-4 border-b border-zinc-800/30 px-4 py-3" style={{ gridTemplateColumns: "7rem 1fr" }}>
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
