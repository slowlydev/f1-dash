"use client";

import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { sortQuali } from "@/lib/sorting/sortQuali";
import { objectEntries } from "@/lib/driverHelper";

import { DriverList, TimingAppData, TimingData } from "@/types/state.type";

import QualifyingDriver from "@/components/QualifyingDriver";

type Props = {
	drivers: DriverList | undefined;
	driversTiming: TimingData | undefined;
	appDriversTiming: TimingAppData | undefined;
};

export default function Qualifying({ drivers, driversTiming, appDriversTiming }: Props) {
	const qualifyingDrivers =
		!driversTiming?.lines || !drivers
			? []
			: objectEntries(driversTiming.lines)
					.filter((d) => !d.pitOut && !d.inPit && !d.knockedOut && !d.stopped) // no out, no pit, no stopped
					.filter((d) => d.sectors.every((sec) => !sec.segments.find((s) => s.status === 2064))) // no in/out lap
					.filter((d) => d.sectors.map((s) => s.personalFastest).includes(true)); // has any personal fastest

	const sessionPart = driversTiming?.sessionPart;
	const comparingDriverPosition = sessionPart === 1 ? 15 : sessionPart === 2 ? 10 : sessionPart === 3 ? 1 : 1;
	const comparingDriver = driversTiming
		? objectEntries(driversTiming.lines).find((d) => parseInt(d.position) === comparingDriverPosition)
		: undefined;

	return (
		<div className="flex gap-4 p-2">
			<AnimatePresence>
				{drivers &&
					qualifyingDrivers
						.sort(sortQuali)
						.map((timingDriver) => (
							<QualifyingDriver
								key={`qualifying.driver.${timingDriver.racingNumber}`}
								driver={drivers[timingDriver.racingNumber]}
								timingDriver={timingDriver}
								appTimingDriver={appDriversTiming?.lines[timingDriver.racingNumber]}
								currentBestName={comparingDriver ? drivers[comparingDriver?.racingNumber].tla : undefined}
								currentBestTime={comparingDriver ? comparingDriver.bestLapTime.value : undefined}
							/>
						))}

				{qualifyingDrivers.length < 1 && (
					<>
						{new Array(3).fill(null).map((_, i) => (
							<SkeletonQualifyingDriver key={`skeleton.qualifying.driver.${i}`} />
						))}
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

const SkeletonQualifyingDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-zinc-800";

	return (
		<div className="flex min-w-72 flex-col gap-2">
			<div className="flex justify-between">
				<div className={clsx(animateClass, "w-20")} />
				<div className={clsx(animateClass, "w-8")} />
			</div>

			<div className="flex w-full justify-between">
				<div className={clsx(animateClass, "w-8")} />

				<div className="flex flex-col items-end gap-1">
					<div className={clsx(animateClass, "!h-4 w-10")} />
					<div className={clsx(animateClass, "!h-3 w-14")} />
				</div>
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "!h-4")} />
						<div className={clsx(animateClass, "!h-3")} />
					</div>
				))}
			</div>
		</div>
	);
};
