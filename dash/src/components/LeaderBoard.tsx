import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { sortPos } from "@/lib/sortPos";
import { objectEntries } from "@/lib/driverHelper";

import { DriverList, TimingAppData, TimingData } from "@/types/state.type";

import Driver from "@/components/Driver";

type Props = {
	drivers: DriverList | undefined;
	driversTiming: TimingData | undefined;
	driversAppTiming: TimingAppData | undefined;
};

export default function LeaderBoard({ drivers, driversTiming, driversAppTiming }: Props) {
	return (
		<div className="flex w-fit flex-col divide-y divide-zinc-800">
			{(!drivers || !driversTiming) &&
				new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} />)}

			{drivers && driversTiming && (
				<AnimatePresence>
					{objectEntries(driversTiming.lines)
						.sort(sortPos)
						.map((timingDriver, index) => (
							<Driver
								key={`leaderBoard.driver.${timingDriver.racingNumber}`}
								driver={drivers[timingDriver.racingNumber]}
								timingDriver={timingDriver}
								appTimingDriver={driversAppTiming?.lines[timingDriver.racingNumber]}
								position={index + 1}
								sessionPart={driversTiming.sessionPart}
							/>
						))}
				</AnimatePresence>
			)}
		</div>
	);
}

const SkeletonDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-gray-700";

	return (
		<div
			className="h-18 grid place-items-center items-center gap-1 py-1"
			style={{
				gridTemplateColumns: "1rem 6rem 4rem 5rem 4rem 5rem 5rem 19.5rem",
			}}
		>
			<div className={animateClass} style={{ width: "95%" }} />

			<div className={animateClass} style={{ width: "95%" }} />

			<div className={animateClass} style={{ width: "90%" }} />

			<div className="flex w-full gap-2">
				<div className={clsx(animateClass, "w-8")} />

				<div className="flex flex-1 flex-col gap-1">
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			</div>

			{new Array(2).fill(null).map((_, index) => (
				<div className="flex w-full flex-col gap-1" key={`skeleton.${index}`}>
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			))}

			<div className="flex w-full flex-col gap-1">
				<div className={clsx(animateClass, "!h-3 w-4/5")} />
				<div className={clsx(animateClass, "!h-4")} />
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "!h-4")} />
						<div className={clsx(animateClass, "!h-3 w-2/3")} />
					</div>
				))}
			</div>
		</div>
	);
};
