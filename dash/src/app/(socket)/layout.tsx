"use client";

import { type ReactNode } from "react";
import { clsx } from "clsx";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useSocket } from "@/hooks/useSocket";
import { useWakeLock } from "@/hooks/useWakeLock";

import { useSettingsStore } from "@/stores/useSettingsStore";

import { WindowsProvider } from "@/context/WindowsContext";

import Menubar from "@/components/Menubar";
import DelayInput from "@/components/DelayInput";
import StreamStatus from "@/components/StreamStatus";
import SegmentedControls from "@/components/SegmentedControls";

type Props = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
	const { handleInitial, handleUpdate, maxDelay } = useDataEngine();

	const connected = useSocket({ handleInitial, handleUpdate });

	useWakeLock();

	const delay = useSettingsStore((state) => state.delay);

	const syncing = delay > maxDelay;

	return (
		<WindowsProvider>
			<div className="w-full">
				<div className="grid grid-cols-1 items-center gap-4 border-b border-zinc-800 bg-black p-2 md:grid-cols-2">
					<Menubar connected={connected} />

					<div className="flex items-center gap-2 sm:hidden">
						{/* <Timeline setTime={setTime} time={time} playing={delay.current > 0} maxDelay={maxDelay} /> */}
						<DelayInput className="flex md:hidden" />
						{/* <PlayControls className="flex md:hidden" playing={playback} onClick={() => togglePlayback()} /> */}
						<StreamStatus live={delay == 0} />
					</div>

					<div className="flex flex-row-reverse flex-wrap-reverse items-center gap-1">
						<DelayInput className="hidden md:flex" />
						{/* <PlayControls className="hidden md:flex" playing={playback} onClick={() => togglePlayback()} /> */}
					</div>
				</div>

				{syncing && (
					<div className="flex w-full flex-col items-center justify-center">
						<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
						<p>Please wait for {delay - maxDelay} seconds.</p>
						<p>Or make your delay smaller.</p>
					</div>
				)}

				<div className={clsx("h-max w-full", syncing && "hidden")}>{children}</div>
			</div>
		</WindowsProvider>
	);
}
