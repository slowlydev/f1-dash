"use client";

import { utc, duration } from "moment";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

import Flag from "@/components/Flag";

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

export default function SessionInfo() {
	const clock = useDataStore((state) => state?.extrapolatedClock);
	const session = useDataStore((state) => state.sessionInfo);
	const timingData = useDataStore((state) => state.timingData);

	const delay = useSettingsStore((state) => state.delay);

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
					<h1 className="truncate text-sm leading-none font-medium text-white">
						{session.meeting.name}: {session.name ?? "Unknown"}
						{timingData?.sessionPart ? ` ${sessionPartPrefix(session.name)}${timingData.sessionPart}` : ""}
					</h1>
				) : (
					<div className="h-4 w-[250px] animate-pulse rounded-md bg-zinc-800" />
				)}

				{timeRemaining !== undefined ? (
					<p className="text-2xl leading-none font-extrabold">{timeRemaining}</p>
				) : (
					<div className="mt-1 h-6 w-[150px] animate-pulse rounded-md bg-zinc-800 font-semibold" />
				)}
			</div>
		</div>
	);
}
