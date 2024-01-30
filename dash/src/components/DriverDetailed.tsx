"use client";

import { motion } from "framer-motion";

import { DriverType } from "@/types/state.type";
import Graph from "./Graph";
import DriverHistoryTires from "./DriverHistoryTires";
import clsx from "clsx";

type Props = {
	driver: DriverType;
};

const maxLength = (values: number[], max: number): number[] => {
	return values.slice(-max);
};

export default function DriverDetailed({ driver }: Props) {
	return (
		<>
			{driver.gapHistory && driver.sectorHisotry && driver.laptimeHistory && (
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
			)}
		</>
	);
}
