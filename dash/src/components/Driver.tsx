"use client";

import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import DriverDetailed from "./DriverDetailed";

import { Driver as DriverType, TimingDataDriver, TimingAppDataDriver } from "@/types/state.type";
import DriverPosChanage from "./DriverPosChange";

type Props = {
	driver: DriverType;
	timingDriver: TimingDataDriver;
	appTimingDriver: TimingAppDataDriver | undefined;
	position: number;
	sessionPart: number | undefined;
};

export default function Driver({ driver, timingDriver, appTimingDriver, position, sessionPart }: Props) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<motion.div
			layout
			onClick={() => setOpen((old) => !old)}
			className={clsx("cursor-pointer select-none px-2", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-violet-800 bg-opacity-30": timingDriver.bestLapTime.position == 1,
				"bg-red-800 bg-opacity-30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				key="always"
				className={clsx("h-18 grid items-center gap-1 py-1")}
				style={{
					gridTemplateColumns: "6rem 4rem 5.5rem 4rem 5rem 5rem auto auto",
				}}
			>
				{/* <DriverPosChanage
					positionChange={parseInt(appTimingDriver?.gridPos ?? "0") - parseInt(timingDriver.position)}
				/> */}
				<DriverTag className="!min-w-[5.5rem]" short={driver.tla} teamColor={driver.teamColour} position={position} />
				<DriverDRS on={false} possible={false} inPit={timingDriver.inPit} pitOut={timingDriver.pitOut} />
				<DriverTire stints={appTimingDriver?.stints} />
				<DriverInfo timingDriver={timingDriver} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} />
				<DriverMiniSectors sectors={timingDriver.sectors} tla={driver.tla} />
			</div>

			{open && <DriverDetailed history={undefined} appTimingDriver={appTimingDriver} />}
		</motion.div>
	);
}

const inDangerZone = (position: number, sessionPart: number) => {
	switch (sessionPart) {
		case 1:
			return position > 15;
		case 2:
			return position > 10;
		case 3:
		default:
			return false;
	}
};
