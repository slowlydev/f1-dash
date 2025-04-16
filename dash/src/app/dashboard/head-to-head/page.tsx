"use client";

import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";
import { useHeadToHeadStore } from "@/stores/useHeadToHeadStore";

import SegmentedControls from "@/components/ui/SegmentedControls";

import HeadToHeadDriver from "./h2h-driver";
import DriverSelect from "./h2h-select";
import HeadToHeadMap from "./h2h-map";

export default function HeadToHeadPage() {
	const drivers = useDataStore((state) => state?.driverList);
	const driversTiming = useDataStore((state) => state?.timingData);

	const { first, second } = useHeadToHeadStore();

	if (!drivers || !driversTiming) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-2xl text-zinc-500">Loading...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex w-full flex-1">
				{first ? (
					<HeadToHeadDriver driverNr={first} side="left" />
				) : (
					<div className="flex-1 p-4">
						<DriverSelect number={"first"} />
					</div>
				)}

				<div className="flex h-full flex-col items-center p-4">
					<hr className="my-1 h-full w-[1px] bg-zinc-800 text-transparent" />

					<p className="text-2xl">VS</p>

					<hr className="my-1 h-full w-[1px] bg-zinc-800 text-transparent" />
				</div>

				{second ? (
					<HeadToHeadDriver driverNr={second} side="right" />
				) : (
					<div className="flex-1 p-4">
						<DriverSelect number={"second"} />
					</div>
				)}
			</div>

			<HeadToHeadMap first={first} second={second} />

			<div className="grid grid-cols-2 gap-2 p-2">
				<Card className="h-96 p-2">
					<SegmentedControls
						options={[
							{ label: "Gap", value: "gap" },
							{ label: "Laptime", value: "lap" },
							{ label: "Sectors", value: "sector" },
						]}
						selected={"gap"}
					/>

					{/* <TimingGraphs /> */}
				</Card>

				<Card className="h-96 p-2">
					<SegmentedControls
						options={[
							{ label: "Throttle", value: "throttle" },
							{ label: "Break", value: "break" },
							{ label: "Gear", value: "gear" },
							{ label: "Speed", value: "speed" },
						]}
						selected={"throttle"}
					/>

					{/* <TimingGraphs /> */}
				</Card>
			</div>
		</div>
	);
}

type Props = {
	children: React.ReactNode;
	className?: string;
};

function Card({ children, className }: Props) {
	return <div className={clsx("rounded-lg border border-zinc-800", className)}>{children}</div>;
}
