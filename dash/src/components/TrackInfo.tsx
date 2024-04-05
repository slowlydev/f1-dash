"use client";

import clsx from "clsx";

import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

import { LapCount, TrackStatus } from "@/types/state.type";

type Props = {
	track: TrackStatus | undefined;
	lapCount: LapCount | undefined;
};

export default function TrackInfo({ track, lapCount }: Props) {
	const currentTrackStatus = getTrackStatusMessage(track?.status ? parseInt(track?.status) : undefined);

	return (
		<div className="flex w-fit flex-row items-center gap-4">
			{!!lapCount && (
				<p className="hidden whitespace-nowrap text-3xl font-extrabold sm:block">
					{lapCount?.currentLap} / {lapCount?.totalLaps}
				</p>
			)}

			{!!currentTrackStatus ? (
				<div
					className={clsx("flex h-8 items-center truncate rounded-md px-2", currentTrackStatus.color)}
					style={{
						boxShadow: `0 0 60px 10px ${currentTrackStatus.hex}`,
					}}
				>
					<p className="text-xl font-semibold">{currentTrackStatus.message}</p>
				</div>
			) : (
				<div className="relative h-8 w-28 animate-pulse overflow-hidden rounded-lg bg-zinc-800" />
			)}
		</div>
	);
}
