"use client";

import clsx from "clsx";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import DriverHistory from "./DriverHistory";

import { DriverType } from "@/types/state.type";

type Props = {
	driver: DriverType;
	position: number;
};

export default function Driver({ driver, position }: Props) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div
			onClick={() => setOpen((old) => !old)}
			className={clsx("px-2", {
				"opacity-50": driver.status === "OUT" || driver.status === "RETIRED" || driver.status === "STOPPED",
				"bg-indigo-800 bg-opacity-30": driver.lapTimes.best.fastest,
				"bg-red-800 bg-opacity-30": false, // TODO use this for danger zone in quali
			})}
		>
			<motion.div
				key="always"
				className={clsx("h-18 grid items-center gap-1 py-1")}
				style={{
					gridTemplateColumns: "6rem 4rem 5.5rem 4rem 5rem 5rem auto auto",
				}}
				layout
			>
				<DriverTag className="!min-w-[5.5rem]" short={driver.short} teamColor={driver.teamColor} position={position} />
				<DriverDRS on={driver.drs.on} possible={driver.drs.possible} driverStatus={driver.status} />
				<DriverTire stints={driver.stints} />
				<DriverInfo status={driver.status} laps={driver.laps} />
				<DriverGap toFront={driver.gapToFront} toLeader={driver.gapToLeader} catching={driver.catchingFront} />
				<DriverLapTime last={driver.lapTimes.last} best={driver.lapTimes.best} />
				<DriverMiniSectors sectors={driver.sectors} driverDisplayName={driver.short} />
			</motion.div>

			<AnimatePresence>
				{open && driver.gapHistory && driver.sectorHisotry && driver.laptimeHistory && (
					<DriverHistory driver={driver} />
				)}
			</AnimatePresence>
		</div>
	);
}
