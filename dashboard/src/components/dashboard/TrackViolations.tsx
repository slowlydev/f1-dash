import type { Driver } from "@/types/state.type";

import { useDataStore } from "@/stores/useDataStore";

import DriverViolations from "./DriverViolations";

type Violations = {
	[key: string]: number;
};

const findCarNumber = (message: string): string | undefined => {
	const match = message.match(/CAR (\d+)/);
	return match?.[1];
};

const sortViolations = (driverA: Driver, driverB: Driver, violations: Violations): number => {
	const a = violations[driverA.RacingNumber];
	const b = violations[driverB.RacingNumber];
	return b - a;
};

export default function TrackViolations() {
	const messages = useDataStore((state) => state.state?.RaceControlMessages);
	const drivers = useDataStore((state) => state.state?.DriverList);
	const driversTiming = useDataStore((state) => state.state?.TimingData);

	const trackLimits =
		messages?.Messages.filter((rcm) => rcm.Category == "Other")
			.filter((rcm) => rcm.Message.includes("TRACK LIMITS"))
			.reduce((acc: Violations, violations) => {
				const carNr = findCarNumber(violations.Message);
				if (!carNr) return acc;

				if (acc[carNr] === undefined) {
					acc[carNr] = 1;
				} else {
					const newValue = acc[carNr] + 1;
					acc[carNr] = newValue;
				}

				return acc;
			}, {}) ?? {};

	const violationDrivers = drivers
		? Object.values(drivers).filter((driver) => trackLimits[driver.RacingNumber] > 0)
		: undefined;

	return (
		<div className="flex flex-col gap-0.5">
			{violationDrivers && violationDrivers.length < 1 && (
				<div className="flex h-96 w-full flex-col items-center justify-center">
					<p className="text-gray-500">No violations yet</p>
				</div>
			)}

			{violationDrivers &&
				trackLimits &&
				violationDrivers
					.sort((a, b) => sortViolations(a, b, trackLimits))
					.map((driver) => (
						<DriverViolations
							key={`violation.driver.${driver.RacingNumber}`}
							driver={driver}
							driversTiming={driversTiming ?? undefined}
							driverViolations={trackLimits[driver.RacingNumber]}
						/>
					))}
		</div>
	);
}
