"use client";

import { motion } from "framer-motion";

import DriverHistoryTires from "@/components/driver/DriverHistoryTires";
import Graph from "@/components/Graph";

import { TimingAppDataDriver, TimingDataDriver } from "@/types/state.type";

type Props = {
	racingNumber: string;
	history: any | undefined;
	timingDriver: TimingDataDriver | undefined;
	appTimingDriver: TimingAppDataDriver;
};

const maxLength = (values: number[], max: number): number[] => {
	return values.slice(-max);
};

export default function DriverDetailed({ racingNumber, history, timingDriver, appTimingDriver }: Props) {
	const firstSectorLength = timingDriver ? timingDriver.sectors[0].segments.length : 6;
	const secondSectorLength = timingDriver ? timingDriver.sectors[1].segments.length : 6;
	const thirdSectorLength = timingDriver ? timingDriver.sectors[2].segments.length : 6;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="grid items-center gap-2 overflow-hidden"
			style={{
				gridTemplateColumns: "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto",
			}}
		>
			<div className="col-span-2 flex flex-col gap-1 place-self-start text-sm font-medium leading-none text-zinc-600">
				{/* <p>Expected Box in 3L</p>
				<p>Average Pit: 22s</p>
				<p>Expected re-join 8th</p> */}
			</div>

			<div className="col-span-2 w-full">
				<DriverHistoryTires stints={appTimingDriver.stints} />
			</div>

			<div>
				{history?.gapFront && history.gapFront && history.gapFront[racingNumber] ? (
					<Graph values={maxLength(history.gapFront[racingNumber], 13)} lines={13} />
				) : (
					<LoadingGraph />
				)}
			</div>

			<div>
				{history?.lapTime && history.lapTime && history.lapTime[racingNumber] ? (
					<Graph values={maxLength(history.lapTime[racingNumber], 13)} lines={13} />
				) : (
					<LoadingGraph />
				)}
			</div>

			<div className="flex gap-2">
				<div style={{ width: `${firstSectorLength * 8 + (firstSectorLength - 1) * 4}px` }}>
					{history?.sectors && history.sectors && history.sectors[racingNumber] && history.sectors[racingNumber][0] ? (
						<Graph values={maxLength(history.sectors[racingNumber][0], 13)} lines={13} />
					) : (
						<LoadingGraph />
					)}
				</div>

				<div style={{ width: `${secondSectorLength * 8 + (secondSectorLength - 1) * 4}px` }}>
					{history?.sectors && history.sectors && history.sectors[racingNumber] && history.sectors[racingNumber][1] ? (
						<Graph values={maxLength(history.sectors[racingNumber][1], 13)} lines={13} />
					) : (
						<LoadingGraph />
					)}
				</div>

				<div style={{ width: `${thirdSectorLength * 8 + (thirdSectorLength - 1) * 4}px` }}>
					{history?.sectors && history.sectors && history.sectors[racingNumber] && history.sectors[racingNumber][2] ? (
						<Graph values={maxLength(history.sectors[racingNumber][2], 13)} lines={13} />
					) : (
						<LoadingGraph />
					)}
				</div>
			</div>
		</motion.div>
	);
}

const LoadingGraph = () => {
	return <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800"></div>;
};
