import { DriverType, RaceControlMessageType } from "../types/state.type";

type Props = {
	messages: RaceControlMessageType[];
	drivers: DriverType[];
};

export default function TrackViolations({ messages, drivers }: Props) {
	const incidents = messages
		.filter((rcm) => rcm.category == "Other")
		.filter((rcm) => rcm.message.includes("INCIDENT INVOLVING"));

	const trackLimits = messages
		.filter((rcm) => rcm.category == "Other")
		.filter((rcm) => rcm.message.includes("TRACK LIMITS"));

	return (
		<div className="flex flex-col">
			<div></div>
		</div>
	);
}
