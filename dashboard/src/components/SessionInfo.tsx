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
	const clock = useDataStore((state) => state.state?.ExtrapolatedClock);
	const session = useDataStore((state) => state.state?.SessionInfo);
	const timingData = useDataStore((state) => state.state?.TimingData);

	const delay = useSettingsStore((state) => state.delay);

	const timeRemaining =
		!!clock && !!clock.Remaining
			? clock.Extrapolating
				? utc(
						duration(clock.Remaining)
							.subtract(utc().diff(utc(clock.Utc)))
							.asMilliseconds() + (delay ? delay * 1000 : 0),
					).format("HH:mm:ss")
				: clock.Remaining
			: undefined;

	return (
		<div className="flex items-center gap-2">
			<Flag countryCode={session?.Meeting.Country.Code} />

			<div className="flex flex-col justify-center">
				{session ? (
					<h1 className="truncate text-sm leading-none font-medium text-white">
						{session.Meeting.Name}: {session.Name ?? "Unknown"}
						{timingData?.SessionPart ? ` ${sessionPartPrefix(session.Name)}${timingData.SessionPart}` : ""}
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
