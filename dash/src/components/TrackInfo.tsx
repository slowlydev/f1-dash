"use client";

import clsx from "clsx";

import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

import { LapCount, TrackStatus } from "@/types/state.type";

type Props = {
	track: TrackStatus | undefined;
	lapCount: LapCount | undefined;
};

export default function TrackInfo({ track, lapCount }: Props) {
	const currentTrackStatus = getTrackStatusMessage(track?.status);

	return (
		<div className="flex w-fit flex-row items-center gap-4">
			{!!lapCount && (
				<p className="whitespace-nowrap text-3xl font-extrabold">
					{lapCount?.current} / {lapCount?.total}
				</p>
			)}

			{!!currentTrackStatus ? (
				<div className={clsx("flex h-8 items-center truncate rounded-md px-2", currentTrackStatus.color)}>
					<p className="text-xl font-semibold">{currentTrackStatus.message}</p>
				</div>
			) : (
				<div className="relative h-8 w-28 animate-pulse overflow-hidden rounded-lg bg-gray-700" />
			)}
		</div>
	);
}
