"use client";

import { AnimatePresence } from "motion/react";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { sortQuali } from "@/lib/sorting";

import QualifyingDriver from "@/components/QualifyingDriver";

export default function Qualifying() {
	const driversTiming = useDataStore((state) => state.timingData);
	const appDriversTiming = useDataStore((state) => state.timingAppData);
	const drivers = useDataStore((state) => state.driverList);

	const qualifyingDrivers =
		!driversTiming?.lines || !drivers
			? []
			: Object.values(driversTiming.lines)
					.filter((d) => !d.pitOut && !d.inPit && !d.knockedOut && !d.stopped) // no out, no pit, no stopped
					.filter((d) => d.sectors.every((sec) => !sec.segments.find((s) => s.status === 2064))) // no in/out lap
					.filter((d) => d.sectors.map((s) => s.personalFastest).includes(true)); // has any personal fastest

	const sessionPart = driversTiming?.sessionPart;
	const comparingDriverPosition = sessionPart === 1 ? 15 : sessionPart === 2 ? 10 : sessionPart === 3 ? 1 : 1;
	const comparingDriver = driversTiming
		? Object.values(driversTiming.lines).find((d) => parseInt(d.position) === comparingDriverPosition)
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
					<div className={clsx(animateClass, "h-4! w-10")} />
					<div className={clsx(animateClass, "h-3! w-14")} />
				</div>
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "h-4!")} />
						<div className={clsx(animateClass, "h-3!")} />
					</div>
				))}
			</div>
		</div>
	);
};
