"use client";

import { motion } from "framer-motion";

import Image from "next/image";

import DriverTag from "./DriverTag";
import DriverMiniSectors from "./DriverMiniSectors";

import { Driver as DriverType, TimingAppDataDriver, TimingDataDriver } from "@/types/state.type";

type Props = {
	driver: DriverType;
	timingDriver: TimingDataDriver;
	appTimingDriver: TimingAppDataDriver | undefined;

	currentBestName: string | undefined;
	currentBestTime: string | undefined;
};

export default function DriverQuali({
	driver,
	timingDriver,
	appTimingDriver,
	currentBestName,
	currentBestTime,
}: Props) {
	const stints = appTimingDriver?.stints ?? [];
	const currentStint = stints ? stints[stints.length - 1] : null;
	const unknownCompound = !["soft", "medium", "hard", "intermediate", "wet"].includes(currentStint?.compound ?? "");

	// const currentTime =

	return (
		<motion.div
			layout
			className="flex w-72 flex-col gap-2"
			exit={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
		>
			<div className="flex justify-between">
				<DriverTag position={parseInt(timingDriver.position)} teamColor={driver.teamColour} short={driver.tla} />
				<div>
					{currentStint && !unknownCompound && currentStint.compound && (
						<Image
							src={`/tires/${currentStint.compound.toLowerCase()}.svg`}
							width={32}
							height={32}
							alt={currentStint.compound}
						/>
					)}

					{currentStint && unknownCompound && (
						<div className="flex h-8 w-8 items-center justify-center">
							<p>?</p>
						</div>
					)}

					{!currentStint && <div className="h-8 w-8 animate-pulse rounded-md bg-gray-700 font-semibold" />}
				</div>
			</div>

			<div className="flex justify-between">
				<p className="text-3xl font-semibold">1231</p>

				<div className="flex flex-col items-end">
					<p className="text-xl leading-none text-gray-500">{currentBestTime}</p>
					<p className="text-sm font-medium leading-none text-gray-500">{currentBestName}</p>
				</div>
			</div>

			<DriverMiniSectors sectors={timingDriver.sectors} tla={`quali.${driver.tla}`} />
		</motion.div>
	);
}
