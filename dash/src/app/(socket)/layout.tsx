"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import tagIcon from "public/tag.png";
// import settingsIcon from "public/icons/settings.svg";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useSocket } from "@/hooks/useSocket";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useWakeLock } from "@/hooks/useWakeLock";

import SessionClock from "@/components/SessionClock";
import DelayInput from "@/components/DelayInput";
import LapCount from "@/components/LapCount";

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	const { handleInitial, handleUpdate, maxDelay } = useDataEngine();

	useSocket({ handleInitial, handleUpdate });

	useWakeLock();

	const delay = useSettingsStore((state) => state.delay);

	const syncing = delay > maxDelay;

	return (
		<div className="flex w-full flex-col">
			<div className="z-20 flex w-full items-center justify-between border-b border-zinc-900 bg-zinc-950 p-2">
				<div className="flex items-center gap-2">
					<Image src={tagIcon} alt="f1-dash" className="size-6" />

					<SessionClock />

					<LapCount />
				</div>

				<div className="flex items-center gap-2">
					<DelayInput />

					{/* <Image src={settingsIcon} alt="settings" className="size-6" /> */}
				</div>
			</div>

			{syncing && (
				<div className="flex w-full flex-col items-center justify-center">
					<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
					<p>Please wait for {delay - maxDelay} seconds,</p>
					<p>or make your delay smaller.</p>
				</div>
			)}

			{!syncing && <div className="p-2">{children}</div>}
		</div>
	);
}
