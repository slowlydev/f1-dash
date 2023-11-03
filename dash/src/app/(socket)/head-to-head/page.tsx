"use client";

import { useState } from "react";
import DriverTag from "../../../components/DriverTag";
import HeadToHeadDriver from "../../../components/HeadToHeadDriver";
import { useSocket } from "../../../context/SocketContext";
import { DriverType } from "../../../types/driver.type";

export default function HeadToHeadPage() {
	const { state } = useSocket();

	const [selectedDriverNumbers, setSelectedDriverNumbers] = useState<DriverType["nr"][]>([]);
	const selectedDrivers: DriverType[] = state?.drivers
		? state.drivers.filter((driver) => selectedDriverNumbers.find((driverNr) => driverNr === driver.nr))
		: [];

	const toggleDriver = (nr: DriverType["nr"]) => {
		setSelectedDriverNumbers((old) => {
			if (old.find((dNr) => dNr === nr)) {
				return old.filter((dNr) => dNr !== nr);
			} else {
				return [...old, nr];
			}
		});
	};

	return (
		<div className="mt-2 w-full">
			{state && state.drivers && (
				<div className="flex gap-2">
					{state.drivers.map((driver) => (
						<div
							key={`driver.selector.${driver.short}`}
							onClick={() => toggleDriver(driver.nr)}
							className="cursor-pointer"
						>
							<DriverTag teamColor={driver.teamColor} short={driver.short} />
						</div>
					))}
				</div>
			)}

			{selectedDrivers.length > 1 && (
				<div className="grid grid-cols-2">
					<HeadToHeadDriver driver={selectedDrivers[0]} />
					<HeadToHeadDriver driver={selectedDrivers[1]} />
				</div>
			)}
		</div>
	);
}
