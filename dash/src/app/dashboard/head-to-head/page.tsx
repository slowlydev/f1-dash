"use client";

import { useState } from "react";

import { objectEntries } from "@/lib/driverHelper";

import { useDataStore } from "@/stores/useDataStore";

import Select from "@/components/ui/Select";
import HeadToHeadDriver from "@/components/HeadToHeadDriver";

export default function HeadToHeadPage() {
	const drivers = useDataStore((state) => state?.driverList);
	const driversTiming = useDataStore((state) => state?.timingData);

	const [[first, second], setSelected] = useState<[string | null, string | null]>([null, null]);

	if (!drivers || !driversTiming) {
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
					<HeadToHeadDriver driver={drivers[first]} timingDriver={driversTiming.lines[first]} />
				) : (
					<div className="flex h-96 flex-col items-center justify-center">
						<Select
							placeholder={`Search & Select a driver`}
							options={objectEntries(drivers)
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
					<HeadToHeadDriver driver={drivers[second]} timingDriver={driversTiming.lines[second]} />
				) : (
					<div className="flex h-96 flex-col items-center justify-center">
						<Select
							placeholder={`Search & Select a driver`}
							options={objectEntries(drivers)
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
