"use client";

import { motion } from "framer-motion";

import { DriverType } from "@/types/state.type";
import Graph from "./Graph";
import DriverHistoryTires from "./DriverHistoryTires";

type Props = {
	driver: DriverType;
};

const maxLength = (values: number[], max: number): number[] => {
	return values.slice(-max);
};

export default function DriverHistory({ driver }: Props) {
	return (
		<>
			{driver.gapHistory && driver.sectorHisotry && driver.laptimeHistory && (
				<motion.div
					key="additonal"
					className="grid items-center gap-1"
					style={{
						gridTemplateColumns: "6rem 13.5rem 5rem 5rem 6rem 6rem 6rem",
					}}
					initial={{ opacity: 0 }}
					exit={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<DriverHistoryTires stints={driver.stints} />

					<div className="text-sm font-medium text-zinc-600">
						<p>Expected to Box in 3 Laps</p>
						<p>Averge Pit Stop Time: 22s</p>
						<p>Expected to re-join 8th</p>
					</div>

					<div>
						<Graph values={maxLength(driver.gapHistory, 13)} lines={13} />
					</div>
					<div>
						<Graph values={maxLength(driver.laptimeHistory, 13)} lines={13} />
					</div>

					{driver.sectorHisotry.map((sector, i) => (
						<div key={`driver.${driver.nr}.sector.hsitory.${i}`}>
							<Graph values={maxLength(sector, 13)} lines={13} />
						</div>
					))}
				</motion.div>
			)}
		</>
	);
}
