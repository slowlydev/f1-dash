import Image from "next/image";

import { Driver, TimingData } from "@/types/state.type";

import { calculatePosition } from "@/lib/calculatePosition";

import DriverTag from "@/components/driver/DriverTag";

import octagonX from "public/icons/x-octagon.svg";

type Props = {
	driver: Driver;
	driverViolations: number;
	driversTiming: TimingData | undefined;
};

export default function TrackViolationsDriver({ driver, driverViolations, driversTiming }: Props) {
	return (
		<div className="flex gap-2" key={`violation.${driver.racingNumber}`}>
			<DriverTag className="h-fit" teamColor={driver.teamColour} short={driver.tla} />
			<div className="flex items-center gap-2">
				{new Array(driverViolations).fill("").map((_, i) => (
					<Image src={octagonX} className="size-6" alt="x in octagon" />
				))}
			</div>
			<div className="flex flex-col justify-center text-sm text-zinc-600">
				<p>
					{driverViolations} Violations
					{driverViolations > 4 && <span> - {Math.round(driverViolations / 5) * 5}s Penalty</span>}
				</p>
				{driverViolations > 4 && driversTiming && (
					<p>
						{calculatePosition(Math.round(driverViolations / 5) * 5, driver.racingNumber, driversTiming)}
						th after Penalty
					</p>
				)}
			</div>
		</div>
	);
}
