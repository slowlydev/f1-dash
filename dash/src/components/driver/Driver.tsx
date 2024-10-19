"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import type { Driver, TimingDataDriver } from "@/types/state.type";

import { useDataStore } from "@/stores/useDataStore";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
// import DriverCarMetrics from "./DriverCarMetrics";

type Props = {
	position: number;
	driver: Driver;
	timingDriver: TimingDataDriver;
};

const hasDRS = (drs: number) => {
	return drs > 9;
};

const possibleDRS = (drs: number) => {
	return drs === 8;
};

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

export default function Driver({ position, driver, timingDriver }: Props) {
	const sessionPart = useDataStore((state) => state.state?.timingData?.sessionPart);
	const timingStatsDriver = useDataStore((state) => state.state?.timingStats?.lines[driver.racingNumber]);
	const appTimingDriver = useDataStore((state) => state.state?.timingAppData?.lines[driver.racingNumber]);
	const carData = useDataStore((state) => (state.carsData ? state.carsData[driver.racingNumber].Channels : undefined));

	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	return (
		<motion.div
			layout="position"
			className={clsx("flex select-none flex-col gap-1 p-1.5", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-violet-800 bg-opacity-30": hasFastest,
				"bg-red-800 bg-opacity-30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				className={clsx("grid items-center gap-2")}
				style={{
					gridTemplateColumns: "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto",
				}}
			>
				<DriverTag className="!min-w-full" short={driver.tla} teamColor={driver.teamColour} position={position} />
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.inPit}
					pitOut={timingDriver.pitOut}
				/>
				<DriverTire stints={appTimingDriver?.stints} />
				<DriverInfo timingDriver={timingDriver} gridPos={appTimingDriver ? parseInt(appTimingDriver.gridPos) : 0} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={hasFastest} />
				<DriverMiniSectors
					sectors={timingDriver.sectors}
					bestSectors={timingStatsDriver?.bestSectors}
					tla={driver.tla}
				/>

				{/* <DriverCarMetrics carData={carData} /> */}
			</div>
		</motion.div>
	);
}
