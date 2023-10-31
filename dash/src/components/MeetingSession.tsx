import moment from "moment";

import type { NextMeetingSession } from "../types/nextMeeting.type";

type Props = {
	session: NextMeetingSession;
};

export default function MeetingSession({ session }: Props) {
	return (
		<div className="flex flex-row items-center gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-2 backdrop-blur-lg">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600">
				<p className="text-xl leading-none">{sessionEmoji(session.name.toLowerCase())}</p>
			</div>
			<div className="flex flex-col gap-1">
				<p className="leading-none">{session.name}</p>
				<p className="text-sm leading-none text-gray-400">
					{moment(`${session.startDate}${session.gmtOffset}`).local().format("DD dddd HH:mm")}
				</p>
			</div>
		</div>
	);
}

const sessionEmoji = (type: string): string => {
	switch (type) {
		case "race":
			return "🏁";
		case "qualifying":
			return "⏱️";
		case "practice":
		default:
			return "🏎️";
	}
};
