"use client";

import { utc, duration } from "moment";

import Flag from "@/components/Flag";

import { useSocket } from "@/context/SocketContext";

import { ExtrapolatedClock, SessionInfo } from "@/types/state.type";

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
						duration(clock.remaining)
							.subtract(utc().diff(utc(clock.utc)))
							.asMilliseconds() + (delay ? delay * 1000 : 0),
				  ).format("HH:mm:ss")
				: clock.remaining
			: undefined;

	return (
		<div className="flex items-center gap-2">
			<Flag countryCode={session?.countryCode} />

			<div className="flex flex-col justify-center">
				{session ? (
					<h1 className="truncate text-sm font-medium leading-none text-white">
						{session.name}: {session.typeName ?? "unknown"}
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
