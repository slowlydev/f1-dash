"use client";

import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";

import { useMode } from "@/context/ModeContext";

import { Driver as DriverType, TimingDataDriver, TimingAppDataDriver, CarDataChannels } from "@/types/state.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import DriverDetailed from "./DriverDetailed";
import DriverCarMetrics from "./DriverCarMetrics";

type Props = {
	position: number;
	sessionPart: number | undefined;
	driver: DriverType;
	timingDriver: TimingDataDriver;
	appTimingDriver: TimingAppDataDriver | undefined;
	carData: CarDataChannels | undefined;
};

export default function Driver({ driver, timingDriver, appTimingDriver, position, sessionPart, carData }: Props) {
	const { uiElements } = useMode();

	const [open, setOpen] = useState<boolean>(false);

	return (
		<motion.div
			layout="position"
			onClick={() => setOpen((old) => !old)}
			className={clsx("flex cursor-pointer select-none flex-col gap-1 p-1.5", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-violet-800 bg-opacity-30": timingDriver.bestLapTime.position == 1,
				"bg-red-800 bg-opacity-30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				className={clsx("grid items-center gap-2")}
				style={{
					gridTemplateColumns: uiElements.carMetrics
						? "5.5rem 4rem 5.5rem 4rem 5rem 5rem auto auto"
						: "5.5rem 4rem 5.5rem 4rem 5rem 5rem auto",
				}}
			>
				<DriverTag className="!min-w-full" short={driver.tla} teamColor={driver.teamColour} position={position} />
				<DriverDRS on={false} possible={false} inPit={timingDriver.inPit} pitOut={timingDriver.pitOut} />
				<DriverTire stints={appTimingDriver?.stints} />
				<DriverInfo timingDriver={timingDriver} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} />
				<DriverMiniSectors sectors={timingDriver.sectors} tla={driver.tla} />

				{uiElements.carMetrics && carData && <DriverCarMetrics carData={carData} />}
			</div>

			{open && appTimingDriver && <DriverDetailed history={undefined} appTimingDriver={appTimingDriver} />}
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
