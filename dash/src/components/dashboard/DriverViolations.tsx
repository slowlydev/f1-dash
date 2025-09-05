import type { Driver, TimingData } from "@/types/state.type";

import { calculatePosition } from "@/lib/calculatePosition";

import DriverTag from "@/components/driver/DriverTag";

type Props = {
	driver: Driver;
	driverViolations: number;
	driversTiming: TimingData | undefined;
};

export default function DriverViolations({ driver, driverViolations, driversTiming }: Props) {
	return (
		<div className="flex gap-2 p-1.5" key={`violation.${driver.racingNumber}`}>
			<DriverTag className="h-fit" teamColor={driver.teamColour} short={driver.tla} />

			<div className="flex flex-col justify-around text-sm leading-none text-zinc-600">
				<p>
					{driverViolations} Violation{driverViolations > 1 ? "s" : ""}
					{driverViolations > 4 && <span> - {Math.round(driverViolations / 5) * 5}s Penalty</span>}
				</p>
				{driverViolations > 4 && driversTiming && (
					<p>
						{calculatePosition(Math.round(driverViolations / 5) * 5, driver.racingNumber, driversTiming)}
						th after penalty
					</p>
				)}
			</div>
		</div>
	);
}
