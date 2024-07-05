"use client";

import { useState } from "react";
import { useSocket } from "@/context/SocketContext";

import Select from "@/components/Select";
import HeadToHeadDriver from "@/components/HeadToHeadDriver";
import { objectEntries } from "@/lib/driverHelper";

export default function HeadToHeadPage() {
	const { state, carsData } = useSocket();

	const [[first, second], setSelected] = useState<[string | null, string | null]>([null, null]);

	if (!state?.driverList || !state?.timingData) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-2xl text-zinc-500">Loading...</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<div className="grid grid-cols-2 divide-x divide-zinc-800">
				{first ? (
					<HeadToHeadDriver
						driver={state.driverList[first]}
						timingDriver={state.timingData.lines[first]}
						timingStatsDriver={state.timingStats?.lines[first]}
						appTimingDriver={state.timingAppData?.lines[first]}
						carData={carsData ? carsData[first].Channels : undefined}
					/>
				) : (
					<div className="flex h-96 flex-col items-center justify-center">
						<Select
							placeholder={`Search & Select a driver`}
							options={objectEntries(state.driverList)
								.map((driver) => ({
									value: driver.racingNumber,
									label: driver.fullName,
								}))
								.filter((driver) => driver.value !== second)}
							selected={first}
							setSelected={(v) => setSelected(([_, second]) => [v, second])}
						/>
					</div>
				)}

				{second ? (
					<HeadToHeadDriver
						driver={state.driverList[second]}
						timingDriver={state.timingData.lines[second]}
						timingStatsDriver={state.timingStats?.lines[second]}
						appTimingDriver={state.timingAppData?.lines[second]}
						carData={carsData ? carsData[second].Channels : undefined}
					/>
				) : (
					<div className="flex h-96 flex-col items-center justify-center">
						<Select
							placeholder={`Search & Select a driver`}
							options={objectEntries(state.driverList)
								.map((driver) => ({
									value: driver.racingNumber,
									label: driver.fullName,
								}))
								.filter((driver) => driver.value !== first)}
							selected={second}
							setSelected={(v) => setSelected(([first, _]) => [first, v])}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
