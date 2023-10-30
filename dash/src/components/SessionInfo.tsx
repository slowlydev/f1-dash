"use client";

import { utc, duration } from "moment";

import { ExtrapolatedClock } from "../types/extrapolated-clock.type";
import { SessionInfo } from "../types/session.type";

import Flag from "./Flag";

import { useSocket } from "../context/SocketContext";

type Props = {
	session: SessionInfo | undefined;
	clock: ExtrapolatedClock | undefined;
};

export default function SessionInfo({ session, clock }: Props) {
	const { delay } = useSocket();

	const timeRemaining =
		!!clock && !!clock.remaining
			? clock.extrapolating
				? utc(
						Math.max(
							duration(clock.remaining)
								.subtract(utc().diff(utc(clock.utc)))
								.asMilliseconds() +
								delay / 1000,
							0,
						),
				  ).format("HH:mm:ss")
				: clock.remaining
			: undefined;

	return (
		<div className="flex flex-auto items-center gap-3">
			<Flag countryCode={session?.countryCode} />

			<div className="flex flex-grow flex-col justify-center">
				{session ? (
					<h1 className="truncate text-sm font-medium text-gray-500">
						{session.name}: {session.typeName ?? "unknown"}
						{!!session.number ? ` Q${session.number}` : ""}
					</h1>
				) : (
					<div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-700" />
				)}

				{timeRemaining !== undefined ? (
					<p className="text-2xl font-extrabold">{timeRemaining}</p>
				) : (
					<div className="mt-1 h-6 w-2/5 animate-pulse rounded-md bg-gray-700 font-semibold" />
				)}
			</div>
		</div>
	);
}
