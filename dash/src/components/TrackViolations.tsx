import { Driver, DriverList, RaceControlMessages, TimingData } from "@/types/state.type";

import { objectEntries } from "@/lib/driverHelper";

import TrackViolationsDriver from "./TrackViolationsDriver";

type Props = {
	messages: RaceControlMessages | undefined;
	drivers: DriverList | undefined;
	driversTiming: TimingData | undefined;
};

type DriverViolations = {
	[key: string]: number;
};

const findCarNumber = (message: string): string | undefined => {
	const carNumberRegex = /CAR (\d+)/;
	const match = message.match(carNumberRegex);
	return match?.[1];
};

const sortViolations = (driverA: Driver, driverB: Driver, violations: DriverViolations): number => {
	const a = violations[driverA.racingNumber];
	const b = violations[driverB.racingNumber];
	return b - a;
};

export default function TrackViolations({ messages, drivers, driversTiming }: Props) {
	const trackLimits =
		messages?.messages
			.filter((rcm) => rcm.category == "Other")
			.filter((rcm) => rcm.message.includes("TRACK LIMITS"))
			.reduce((acc: DriverViolations, violations) => {
				const carNr = findCarNumber(violations.message);
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
		? objectEntries(drivers).filter((driver) => trackLimits[driver.racingNumber] > 0)
		: undefined;

	return (
		<div className="flex flex-col gap-2">
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
						<TrackViolationsDriver
							key={`violation.driver.${driver.racingNumber}`}
							driver={driver}
							driversTiming={driversTiming}
							driverViolations={trackLimits[driver.racingNumber]}
						/>
					))}
		</div>
	);
}
