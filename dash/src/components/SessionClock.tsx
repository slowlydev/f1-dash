"use client";

import { utc, duration } from "moment";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SessionClock() {
	const clock = useDataStore((state) => state?.extrapolatedClock);

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
		<div className="flex items-center">
			{timeRemaining !== undefined ? (
				<p className="text-lg tabular-nums">{timeRemaining}</p>
			) : (
				<div className="h-7 w-[80px] animate-pulse rounded-lg bg-zinc-800" />
			)}
		</div>
	);
}
