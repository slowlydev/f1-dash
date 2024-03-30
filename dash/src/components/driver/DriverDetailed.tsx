"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import DriverHistoryTires from "@/components/driver/DriverHistoryTires";
import Graph from "@/components/Graph";

import { TimingAppDataDriver, TimingDataDriver } from "@/types/state.type";
import { History } from "@/types/history.type";

type Props = {
	racingNumber: string;
	history: History | undefined;
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
			initial={{ opacity: 0 }}
			exit={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={clsx("grid items-center gap-2")}
			style={{
				gridTemplateColumns: "10rem 9.5rem 5rem 5rem auto",
			}}
		>
			<div className="flex flex-col gap-1  place-self-start text-sm font-medium leading-none text-zinc-600">
				<p>Expected Box in 3L</p>
				<p>Average Pit: 22s</p>
				<p>Expected re-join 8th</p>
			</div>

			<div className="w-full">
				<DriverHistoryTires stints={appTimingDriver.stints} />
			</div>

			<div className="">
				{history?.gapFront && history.gapFront && history.gapFront[racingNumber] ? (
					<Graph values={maxLength(history.gapFront[racingNumber], 13)} lines={13} />
				) : (
					<LoadingGraph />
				)}
			</div>
			<div className="">
				{history?.lapTime && history.lapTime && history.lapTime[racingNumber] ? (
					<Graph values={maxLength(history.lapTime[racingNumber], 13)} lines={13} />
				) : (
					<LoadingGraph />
				)}
			</div>

			<div className="flex gap-2">
				<div style={{ width: `${firstSectorLength * 8 + firstSectorLength * 4}px` }}>
					{history?.sectors && history.sectors && history.sectors[racingNumber] && history.sectors[racingNumber][0] ? (
						<Graph values={maxLength(history.sectors[racingNumber][0], 13)} lines={13} />
					) : (
						<LoadingGraph />
					)}
				</div>
				<div style={{ width: `${secondSectorLength * 8 + secondSectorLength * 4}px` }}>
					{history?.sectors && history.sectors && history.sectors[racingNumber] && history.sectors[racingNumber][1] ? (
						<Graph values={maxLength(history.sectors[racingNumber][1], 13)} lines={13} />
					) : (
						<LoadingGraph />
					)}
				</div>
				<div style={{ width: `${thirdSectorLength * 8 + thirdSectorLength * 4}px` }}>
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
