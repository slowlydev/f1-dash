import { AnimatePresence, LayoutGroup } from "framer-motion";
import clsx from "clsx";
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { useSortingStore, type SortingCriteria } from "@/stores/useSortingStore";

import { sortDrivers } from "@/lib/sorting";
import { objectEntries } from "@/lib/driverHelper";

import Driver from "@/components/driver/Driver";
import Select from "@/components/Select";

const sortOptions = [
	{ label: "Position", value: "position" as SortingCriteria },
	{ label: "Best Lap", value: "bestLap" as SortingCriteria },
	{ label: "Last Lap", value: "lastLap" as SortingCriteria },
	{ label: "Pit Status", value: "pitStatus" as SortingCriteria },
	{ label: "Position Change", value: "positionChange" as SortingCriteria },
	{ label: "Sector 1", value: "sector1" as SortingCriteria },
	{ label: "Sector 2", value: "sector2" as SortingCriteria },
	{ label: "Sector 3", value: "sector3" as SortingCriteria },
	{ label: "Tyre Age", value: "tyreAge" as SortingCriteria },
];

const columnSortMapping: Record<string, SortingCriteria> = {
	"Position": "position",
	"Tire": "tyreAge",
	"Info": "positionChange",
	"Gap": "position",
	"LapTime": "bestLap",
	"Sectors": "sector1",
};

export default function LeaderBoard() {
	const drivers = useDataStore((state) => state?.driverList);
	const driversTiming = useDataStore((state) => state?.timingData);
	const driversAppTiming = useDataStore((state) => state?.timingAppData);

	const showTableHeader = useSettingsStore((state) => state.tableHeaders);
	const sortCriteria = useSortingStore((state) => state.criteria);
	const sortDirection = useSortingStore((state) => state.direction);
	const showSortOptions = useSortingStore((state) => state.showSortOptions);
	const setSortCriteria = useSortingStore((state) => state.setCriteria);
	const toggleDirection = useSortingStore((state) => state.toggleDirection);
	const toggleSortOptions = useSortingStore((state) => state.toggleSortOptions);
	const setSort = useSortingStore((state) => state.setSort);

	return (
		<div className="flex flex-col">
			<div className="h-10 flex items-center gap-2 px-2 mb-2">
				<button
					onClick={toggleSortOptions}
					className="flex items-center gap-1 rounded bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
					title="Toggle sort options"
				>
					<BiSortAlt2 className="h-4 w-4" />
					<span>Sort</span>
				</button>
				
				{sortDirection === "asc" ? 
					<BiSortUp className="h-5 w-5 cursor-pointer text-zinc-400 hover:text-zinc-200" onClick={toggleDirection} title="Sort Direction: Ascending" /> : 
					<BiSortDown className="h-5 w-5 cursor-pointer text-zinc-400 hover:text-zinc-200" onClick={toggleDirection} title="Sort Direction: Descending" />
				}

				{showSortOptions && (
					<div className="w-48">
						<Select<SortingCriteria>
							placeholder="Sort by"
							options={sortOptions}
							selected={sortCriteria}
							setSelected={(value) => value && setSortCriteria(value)}
						/>
					</div>
				)}
			</div>

			<div className="flex w-fit flex-col divide-y divide-zinc-800">
				{showTableHeader && <TableHeaders 
					currentSort={sortCriteria} 
					direction={sortDirection} 
					onSortChange={setSort} 
				/>}

				{(!drivers || !driversTiming) &&
					new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} />)}

				<LayoutGroup key="drivers">
					{drivers && driversTiming && (
						<AnimatePresence>
							{objectEntries(driversTiming.lines)
								.sort((a, b) => 
									sortDrivers(
										sortCriteria,
										sortDirection,
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

type TableHeadersProps = {
	currentSort: SortingCriteria;
	direction: "asc" | "desc";
	onSortChange: (criteria: SortingCriteria) => void;
};

const TableHeaders = ({ currentSort, direction, onSortChange }: TableHeadersProps) => {
	const renderSortIcon = (column: string) => {
		const criteria = columnSortMapping[column];
		if (!criteria || currentSort !== criteria) return null;
		
		return direction === "asc" 
			? <BiSortUp className="ml-1 inline h-4 w-4" /> 
			: <BiSortDown className="ml-1 inline h-4 w-4" />;
	};

	const createClickHandler = (column: string) => {
		const criteria = columnSortMapping[column];
		if (!criteria) return undefined;
		
		return () => onSortChange(criteria);
	};

	const headerClass = (column: string) => clsx(
		"cursor-pointer hover:text-zinc-300 transition-colors duration-150 flex items-center",
		columnSortMapping[column] && currentSort === columnSortMapping[column] ? "text-sky-400" : ""
	);

	return (
		<div
			className="grid items-center gap-2 p-1 px-2 text-sm font-medium text-zinc-500"
			style={{
				gridTemplateColumns: "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto auto",
			}}
		>
			<div className={headerClass("Position")} onClick={createClickHandler("Position")}>
				<span>Position</span>
				{renderSortIcon("Position")}
			</div>
			<p>DRS</p>
			<div className={headerClass("Tire")} onClick={createClickHandler("Tire")}>
				<span>Tire</span>
				{renderSortIcon("Tire")}
			</div>
			<div className={headerClass("Info")} onClick={createClickHandler("Info")}>
				<span>Info</span>
				{renderSortIcon("Info")}
			</div>
			<div className={headerClass("Gap")} onClick={createClickHandler("Gap")}>
				<span>Gap</span>
				{renderSortIcon("Gap")}
			</div>
			<div className={headerClass("LapTime")} onClick={createClickHandler("LapTime")}>
				<span>LapTime</span>
				{renderSortIcon("LapTime")}
			</div>
			<div className={headerClass("Sectors")} onClick={createClickHandler("Sectors")}>
				<span>Sectors</span>
				{renderSortIcon("Sectors")}
			</div>
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
