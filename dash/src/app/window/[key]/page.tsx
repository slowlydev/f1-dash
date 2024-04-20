"use client";

import { useEffect, useState } from "react";

import { CarData, Position, State } from "@/types/state.type";
import { WindowMessage } from "@/types/window-message.type";
import { WindowKey } from "@/lib/data/windows";

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
	// note, we can not use the context here we use on the dashboard page, as this is a complete new instance of the website
	// thats why we use window messages to get the state updates from the main window
	// main disadvantages are that we use requestAnimation frame which stops if the main window is not the active tab
	// so we don't get updates anymore

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
					trackStatus={state?.trackStatus}
					raceControlMessages={state?.raceControlMessages?.messages}
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
