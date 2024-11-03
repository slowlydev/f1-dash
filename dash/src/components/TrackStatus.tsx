"use client";

import clsx from "clsx";

import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

import { useDataStore } from "@/stores/useDataStore";

export default function TrackStatus() {
	const track = useDataStore((state) => state?.trackStatus);

	const currentTrackStatus = getTrackStatusMessage(track?.status ? parseInt(track?.status) : undefined);

	if (!currentTrackStatus) {
		return <div className="relative h-8 w-28 animate-pulse overflow-hidden rounded-lg bg-zinc-800" />;
	}

	return (
		<div
			className={clsx("flex items-center rounded-lg px-2", currentTrackStatus.color)}
			style={{
				boxShadow: `0 0 20px 0 ${currentTrackStatus.hex}`,
			}}
		>
			<p className="text-lg font-semibold">{currentTrackStatus.message}</p>
		</div>
	);
}
