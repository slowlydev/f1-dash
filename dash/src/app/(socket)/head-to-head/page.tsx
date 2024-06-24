"use client";

import { useState } from "react";
import { useSocket } from "@/context/SocketContext";

import DriverTag from "@/components/driver/DriverTag";
import HeadToHeadDriver from "@/components/HeadToHeadDriver";

import { objectEntries } from "@/lib/driverHelper";

export default function HeadToHeadPage() {
	const { state, carsData } = useSocket();

	const [selectedNrs, setSelectedNrs] = useState<string[]>([]);

	const toggleDriver = (nr: string) => {
		setSelectedNrs((old) => {
			if (old.find((dNr) => dNr === nr)) {
				return old.filter((dNr) => dNr !== nr);
			} else {
				return [...old, nr];
			}
		});
	};

	return (
		<div className="m-2 w-full">
			{state && state.driverList && (
				<div className="flex gap-2">
					{objectEntries(state.driverList).map((driver) => (
						<div
							key={`driver.selector.${driver.racingNumber}`}
							onClick={() => toggleDriver(driver.racingNumber)}
							className="cursor-pointer"
						>
							<DriverTag teamColor={driver.teamColour} short={driver.tla} />
						</div>
					))}
				</div>
			)}

			{selectedNrs.length > 1 && state?.driverList && state?.timingData && (
				<div className="grid grid-cols-2 gap-2">
					<HeadToHeadDriver
						driver={state.driverList[selectedNrs[0]]}
						timingDriver={state.timingData.lines[selectedNrs[0]]}
						timingStatsDriver={state.timingStats?.lines[selectedNrs[0]]}
						appTimingDriver={state.timingAppData?.lines[selectedNrs[0]]}
						carData={carsData ? carsData[selectedNrs[0]].Channels : undefined}
					/>
					<HeadToHeadDriver
						driver={state.driverList[selectedNrs[1]]}
						timingDriver={state.timingData.lines[selectedNrs[1]]}
						timingStatsDriver={state.timingStats?.lines[selectedNrs[1]]}
						appTimingDriver={state.timingAppData?.lines[selectedNrs[1]]}
						carData={carsData ? carsData[selectedNrs[1]].Channels : undefined}
					/>
				</div>
			)}
		</div>
	);
}
