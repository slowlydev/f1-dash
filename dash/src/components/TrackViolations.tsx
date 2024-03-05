import { DriverList, RaceControlMessages } from "@/types/state.type";

type Props = {
	messages: RaceControlMessages;
	drivers: DriverList;
};

export default function TrackViolations({ messages, drivers }: Props) {
	const incidents = messages.messages
		.filter((rcm) => rcm.category == "Other")
		.filter((rcm) => rcm.message.includes("INCIDENT INVOLVING"));

	const trackLimits = messages.messages
		.filter((rcm) => rcm.category == "Other")
		.filter((rcm) => rcm.message.includes("TRACK LIMITS"));

	return (
		<div className="flex flex-col">
			<div></div>
		</div>
	);
}
