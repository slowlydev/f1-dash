"use client";

import { motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";

import DriverTag from "./driver/DriverTag";

import type { Driver as DriverType, TimingAppDataDriver, TimingDataDriver } from "@/types/state.type";

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
	const unknownCompound = !["soft", "medium", "hard", "intermediate", "wet"].includes(
		currentStint?.compound?.toLowerCase() ?? "",
	);

	const currentTime = timingDriver.sectors[2].value
		? timingDriver.sectors[2].value
		: timingDriver.sectors[1].value
			? timingDriver.sectors[1].value
			: timingDriver.sectors[0].value
				? timingDriver.sectors[0].value
				: "-- --";

	return (
		<motion.div
			layout
			className="flex min-w-72 flex-col gap-2"
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
						<Image src={`/tires/unknown.svg`} width={32} height={32} alt={"unknown"} />
					)}

					{!currentStint && <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-800 font-semibold" />}
				</div>
			</div>

			<div className="flex justify-between">
				<p className="text-3xl font-semibold">{currentTime}</p>

				<div className="flex flex-col items-end">
					{currentBestTime && (
						<>
							<p className="text-xl leading-none text-zinc-500">{currentBestTime}</p>
							<p className="text-sm leading-none font-medium text-zinc-500">{currentBestName}</p>
						</>
					)}
				</div>
			</div>

			<div className="grid grid-cols-3 gap-1">
				{timingDriver.sectors.map((sector, i) => (
					<div className="flex flex-col gap-1" key={`quali.sector.${driver.tla}.${i}`}>
						<div
							className={clsx("h-4 rounded-md", {
								"bg-zinc-500!": !sector.value,
								"bg-violet-500": sector.overallFastest,
								"bg-emerald-500": sector.personalFastest,
								"bg-amber-400": !sector.overallFastest && !sector.personalFastest,
							})}
						/>
						<p
							className={clsx("text-center text-lg leading-none font-semibold", {
								"text-zinc-500!": !sector.value,
								"text-violet-500": sector.overallFastest,
								"text-emerald-500": sector.personalFastest,
								"text-yellow-500": !sector.overallFastest && !sector.personalFastest,
							})}
						>
							{!!sector.value ? sector.value : "-- ---"}
						</p>
					</div>
				))}
			</div>
		</motion.div>
	);
}
