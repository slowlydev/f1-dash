"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import type { Driver, TimingDataDriver } from "@/types/state.type";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useCarDataStore, useDataStore } from "@/stores/useDataStore";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverInfo from "./DriverInfo";
import DriverLapTime from "./DriverLapTime";
import DriverMiniSectors from "./DriverMiniSectors";

type Props = {
	position: number;
	driver: Driver;
	timingDriver: TimingDataDriver;
};

const hasDRS = (drs: number) => drs > 9;

const possibleDRS = (drs: number) => drs === 8;

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
	const sessionPart = useDataStore((state) => state?.timingData?.sessionPart);
	const timingStatsDriver = useDataStore((state) => state?.timingStats?.lines[driver.racingNumber]);
	const appTimingDriver = useDataStore((state) => state?.timingAppData?.lines[driver.racingNumber]);
	const carData = useCarDataStore((state) =>
		state?.carsData ? state.carsData[driver.racingNumber].Channels : undefined,
	);

	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(driver.racingNumber));

	return (
		<motion.div
			layout="position"
			className={clsx("grid select-none items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950 p-2", {
				"!bg-yellow-700 !bg-opacity-40": favoriteDriver,
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"!bg-violet-800 !bg-opacity-40": hasFastest,
				"!bg-red-800 !bg-opacity-40": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
			style={{
				gridTemplateColumns: "5rem 3rem 5.5rem 4rem 5rem 5.5rem auto",
			}}
		>
			<DriverTag className="!min-w-20" short={driver.tla} teamColor={driver.teamColour} position={position} />
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
			<DriverMiniSectors sectors={timingDriver.sectors} tla={driver.tla} />
		</motion.div>
	);
}
