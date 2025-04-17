import { AnimatePresence, LayoutGroup } from "framer-motion";
import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { useSortingStore, type SortingCriteria } from "@/stores/useSortingStore";

import { sortDrivers } from "@/lib/sorting";
import { objectEntries } from "@/lib/driverHelper";

import Driver from "@/components/driver/Driver";

const sortOptions: { label: string; value: SortingCriteria }[] = [
	{ label: "Position", value: "position" },
	{ label: "Best Lap", value: "bestLap" },
	{ label: "Last Lap", value: "lastLap" },
	{ label: "Pit Status", value: "pitStatus" },
	{ label: "Position Change", value: "positionChange" },
	{ label: "Sector 1", value: "sector1" },
	{ label: "Sector 2", value: "sector2" },
	{ label: "Sector 3", value: "sector3" },
	{ label: "Tyre Age", value: "tyreAge" },
];

export default function LeaderBoard() {
	const drivers = useDataStore((state) => state?.driverList);
	const driversTiming = useDataStore((state) => state?.timingData);
	const driversAppTiming = useDataStore((state) => state?.timingAppData);

	const showTableHeader = useSettingsStore((state) => state.tableHeaders);
	const sortCriteria = useSortingStore((state) => state.criteria);
	const setSortCriteria = useSortingStore((state) => state.setCriteria);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 px-2">
				<label className="text-sm font-medium text-zinc-500">Sort by:</label>
				<select
					value={sortCriteria}
					onChange={(e) => setSortCriteria(e.target.value as SortingCriteria)}
					className="rounded bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300 outline-none hover:bg-zinc-700 focus:ring-2 focus:ring-sky-500"
				>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value} className="bg-zinc-800">
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex w-fit flex-col divide-y divide-zinc-800">
				{showTableHeader && <TableHeaders />}

				{(!drivers || !driversTiming) &&
					new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} />)}

				<LayoutGroup key="drivers">
					{drivers && driversTiming && (
						<AnimatePresence>
							{objectEntries(driversTiming.lines)
								.sort((a, b) => 
									sortDrivers(
										sortCriteria,
										a,
										b,
										driversAppTiming?.lines[a.racingNumber],
										driversAppTiming?.lines[b.racingNumber]
									)
								)
								.map((timingDriver, index) => (
									<Driver
										key={`leaderBoard.driver.${timingDriver.racingNumber}`}
										position={index + 1}
										driver={drivers[timingDriver.racingNumber]}
										timingDriver={timingDriver}
									/>
								))}
						</AnimatePresence>
					)}
				</LayoutGroup>
			</div>
		</div>
	);
}

const TableHeaders = () => {
	return (
		<div
			className="grid items-center gap-2 p-1 px-2 text-sm font-medium text-zinc-500"
			style={{
				gridTemplateColumns: "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto auto",
			}}
		>
			<p>Position</p>
			<p>DRS</p>
			<p>Tire</p>
			<p>Info</p>
			<p>Gap</p>
			<p>LapTime</p>
			<p>Sectors</p>
		</div>
	);
};

const SkeletonDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-zinc-800";

	return (
		<div
			className="h-18 grid place-items-center items-center gap-1 px-2 py-1"
			style={{
				gridTemplateColumns: "6rem 4rem 5rem 4rem 5rem 5rem 19.5rem",
			}}
		>
			<div className={animateClass} style={{ width: "100%" }} />

			<div className={animateClass} style={{ width: "90%" }} />

			<div className="flex w-full gap-2">
				<div className={clsx(animateClass, "w-8")} />

				<div className="flex flex-1 flex-col gap-1">
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			</div>

			{new Array(2).fill(null).map((_, index) => (
				<div className="flex w-full flex-col gap-1" key={`skeleton.${index}`}>
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			))}

			<div className="flex w-full flex-col gap-1">
				<div className={clsx(animateClass, "!h-3 w-4/5")} />
				<div className={clsx(animateClass, "!h-4")} />
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "!h-4")} />
						<div className={clsx(animateClass, "!h-3 w-2/3")} />
					</div>
				))}
			</div>
		</div>
	);
};
