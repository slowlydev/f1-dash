"use client";

import { utc, duration } from "moment";

import Flag from "@/components/Flag";

import { useSocket } from "@/context/SocketContext";

import { ExtrapolatedClock, SessionInfo as SessionInfoType, TimingData } from "@/types/state.type";

type Props = {
	session: SessionInfoType | undefined;
	clock: ExtrapolatedClock | undefined;
	timingData: TimingData | undefined;
};

const sessionPartPrefix = (name: string) => {
	switch (name) {
		case "Sprint Qualifying":
			return "SQ";
		case "Qualifying":
			return "Q";
		default:
			return "";
	}
};

export default function SessionInfo({ session, clock, timingData }: Props) {
	const { delay } = useSocket();

	const timeRemaining =
		!!clock && !!clock.remaining
			? clock.extrapolating
				? utc(
						duration(clock.remaining)
							.subtract(utc().diff(utc(clock.utc)))
							.asMilliseconds() + (delay ? delay * 1000 : 0),
					).format("HH:mm:ss")
				: clock.remaining
			: undefined;

	return (
		<div className="flex items-center gap-2">
			<Flag countryCode={session?.meeting.country.code} />

			<div className="flex flex-col justify-center">
				{session ? (
					<h1 className="truncate text-sm font-medium leading-none text-white">
						{session.meeting.name}: {session.name ?? "Unknown"}
						{timingData?.sessionPart ? ` ${sessionPartPrefix(session.name)}${timingData.sessionPart}` : ""}
					</h1>
				) : (
					<div className="h-4 w-[250px] animate-pulse rounded-md bg-zinc-800" />
				)}

				{timeRemaining !== undefined ? (
					<p className="text-2xl font-extrabold leading-none">{timeRemaining}</p>
				) : (
					<div className="mt-1 h-6 w-[150px] animate-pulse rounded-md bg-zinc-800 font-semibold" />
				)}
			</div>
		</div>
	);
}
