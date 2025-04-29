"use client";

import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

export default function TrackInfo() {
	const lapCount = useDataStore((state) => state.lapCount);
	const track = useDataStore((state) => state.trackStatus);

	const currentTrackStatus = getTrackStatusMessage(track?.status ? parseInt(track?.status) : undefined);

	return (
		<div className="flex flex-row items-center gap-4 md:justify-self-end">
			{!!lapCount && (
				<p className="text-3xl font-extrabold whitespace-nowrap">
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
					<p className="text-lg font-medium">{currentTrackStatus.message}</p>
				</div>
			) : (
				<div className="relative h-8 w-28 animate-pulse overflow-hidden rounded-lg bg-zinc-800" />
			)}
		</div>
	);
}
