"use client";

import { useEffect, useState } from "react";

import { CarsData, Positions, State } from "@/types/state.type";
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
	// thats why we use broadcast channels to get the state updates from the main window
	// main disadvantages are that we use requestAnimation frame which stops if the main window is not the active tab
	// so we don't get updates anymore

	const [state, setState] = useState<null | State>();
	const [_carsData, setCarsData] = useState<null | CarsData>(null);
	const [positions, setPositions] = useState<null | Positions>(null);

	useEffect(() => {
		if (window != undefined) {
			const stateChannel = new BroadcastChannel("state");
			stateChannel.onmessage = (msg) => setState(msg.data);

			const carDataChannel = new BroadcastChannel("carData");
			carDataChannel.onmessage = (msg) => setCarsData(msg.data);

			const positionChannel = new BroadcastChannel("position");
			positionChannel.onmessage = (msg) => setPositions(msg.data);
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
					positions={positions}
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
