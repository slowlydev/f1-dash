"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import DriverHistoryTires from "@/components/DriverHistoryTires";
import Graph from "@/components/Graph";

import { Driver as DriverType, TimingDataDriver, TimingAppDataDriver } from "@/types/state.type";

type Props = {
	history: undefined;
	appTimingDriver: TimingAppDataDriver | undefined;
};

const maxLength = (values: number[], max: number): number[] => {
	return values.slice(-max);
};

export default function DriverDetailed({ history, appTimingDriver }: Props) {
	return (
		<>
			{/* {driver.gapHistory && driver.sectorHisotry && driver.laptimeHistory && (
				<motion.div
					key="additonal"
					className={clsx("grid place-items-center items-center gap-1 py-1")}
					style={{
						gridTemplateColumns: "10rem 9.5rem 5.5rem 5rem auto auto",
					}}
					initial={{ opacity: 0 }}
					exit={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<div className="flex flex-col gap-1  place-self-start text-sm font-medium leading-none text-zinc-600">
						<p>Expected Box in 3L</p>
						<p>Averge Pit: 22s</p>
						<p>Expected re-join 8th</p>
					</div>

					<div className="w-full">
						<DriverHistoryTires stints={driver.stints} />
					</div>

					<div className="">
						<Graph values={maxLength(driver.gapHistory, 13)} lines={13} />
					</div>
					<div className="">
						<Graph values={maxLength(driver.laptimeHistory, 13)} lines={13} />
					</div>

					<div className="flex w-full justify-between gap-2">
						<div>
							<Graph values={maxLength(driver.sectorHisotry[0] ?? [], 13)} lines={13} />
						</div>
						<div>
							<Graph values={maxLength(driver.sectorHisotry[1] ?? [], 13)} lines={13} />
						</div>
						<div>
							<Graph values={maxLength(driver.sectorHisotry[2] ?? [], 13)} lines={13} />
						</div>
					</div>
				</motion.div>
			)} */}
		</>
	);
}
