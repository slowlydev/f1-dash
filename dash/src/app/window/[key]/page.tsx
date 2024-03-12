"use client";

import { useEffect, useState } from "react";

import { CarData, Position, State } from "@/types/state.type";
import { WindowMessage } from "@/types/window-message.type";
import { WindowKey } from "@/lib/windows";

import TrackViolations from "@/components/TrackViolations";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import Map from "@/components/Map";

type Props = {
	params: {
		key: WindowKey;
	};
};

export default function SubWindow({ params: { key } }: Props) {
	const [state, setState] = useState<null | State>();
	const [carData, setCarData] = useState<null | CarData>(null);
	const [position, setPosition] = useState<null | Position>(null);

	useEffect(() => {
		if (window != undefined) {
			window.addEventListener("message", (event) => {
				const windowMessage: WindowMessage = event.data;

				switch (windowMessage.updateType) {
					case "state": {
						setState(windowMessage.state);
						break;
					}
					case "car-data": {
						setCarData(windowMessage.carData);
						break;
					}
					case "position": {
						setPosition(windowMessage.position);
						break;
					}
				}
			});
		}
	}, []);

	return (
		<div className="p-2">
			{key === "rcm" && (
				<RaceControl messages={state?.raceControlMessages} utcOffset={state?.sessionInfo?.gmtOffset ?? ""} />
			)}

			{key === "team-radios" && (
				<TeamRadios sessionPath={state?.sessionInfo?.path} drivers={state?.driverList} teamRadios={state?.teamRadio} />
			)}

			{key === "track-map" && (
				<Map
					circuitKey={state?.sessionInfo?.meeting.circuit.key}
					drivers={state?.driverList}
					timingDrivers={state?.timingData}
					positionBatches={position}
				/>
			)}

			{key === "track-limits" && (
				<TrackViolations
					messages={state?.raceControlMessages}
					drivers={state?.driverList}
					driversTiming={state?.timingData}
				/>
			)}
		</div>
	);
}
