import Image from "next/image";

import { DriverList, RaceControlMessages, TimingData } from "@/types/state.type";

import { objectEntries } from "@/lib/driverHelper";

import DriverTag from "./driver/DriverTag";

import octagonX from "../../public/icons/x-octagon.svg";

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

export default function TrackViolations({ messages, drivers }: Props) {
	const trackLimits =
		messages?.messages
			.filter((rcm) => rcm.category == "Other")
			.filter((rcm) => rcm.message.includes("TRACK LIMITS"))
			.reduce((acc: DriverViolations, violations) => {
				const carNr = findCarNumber(violations.message);
				if (!carNr) return acc;

				if (!acc[carNr]) {
					acc[carNr] = 0;
				} else {
					acc[carNr] = acc[carNr] + 1;
				}

				return acc;
			}, {}) ?? {};

	const violationDrivers = drivers
		? objectEntries(drivers).filter((driver) => trackLimits[driver.racingNumber] < 1)
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
				violationDrivers.map((driver) => (
					<div className="flex gap-2" key={`violation.${driver.racingNumber}`}>
						<DriverTag teamColor={driver.teamColour} short={driver.tla} />
						<div className="flex gap-2">
							{new Array(trackLimits[driver.racingNumber]).fill("").map((_, i) => (
								<Image src={octagonX} className="size-8" alt="x in octagon" />
							))}
						</div>
						<div className="flex flex-col">{}</div>
					</div>
				))}
		</div>
	);
}
