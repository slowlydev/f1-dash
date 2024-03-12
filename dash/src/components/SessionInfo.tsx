"use client";

import { utc, duration } from "moment";

<<<<<<< HEAD
import Flag from "@/components/Flag";
=======
import { ExtrapolatedClock } from "../types/extrapolated-clock.type";
import { SessionInfo as SessionInfoType } from "../types/session.type";
>>>>>>> 0f3c8938b26873181d27ad5d50d05fb2187d85d4

import { useSocket } from "@/context/SocketContext";

import { ExtrapolatedClock, SessionInfo as SessionInfoType } from "@/types/state.type";

type Props = {
	session: SessionInfoType | undefined;
	clock: ExtrapolatedClock | undefined;
};

export default function SessionInfo({ session, clock }: Props) {
	const { delay } = useSocket();

	const delayCurrent = delay.current;

	const timeRemaining =
		!!clock && !!clock.remaining
			? clock.extrapolating
				? utc(
						duration(clock.remaining)
							.subtract(utc().diff(utc(clock.utc)))
							.asMilliseconds() + (delayCurrent ? delayCurrent * 1000 : 0),
					).format("HH:mm:ss")
				: clock.remaining
			: undefined;

	return (
		<div className="flex items-center gap-2">
			<Flag countryCode={session?.meeting.country.code} />

			<div className="flex flex-col justify-center">
				{session ? (
					<h1 className="truncate text-sm font-medium leading-none text-white">
						{session.meeting.name}: {session.type ?? "unknown"}
						{!!session.number ? ` Q${session.number}` : ""}
					</h1>
				) : (
					<div className="h-4 w-[130px] animate-pulse rounded-md bg-gray-700" />
				)}

				{timeRemaining !== undefined ? (
					<p className="text-2xl font-extrabold leading-none">{timeRemaining}</p>
				) : (
					<div className="mt-1 h-6 w-[100px] animate-pulse rounded-md bg-gray-700 font-semibold" />
				)}
			</div>
		</div>
	);
}
