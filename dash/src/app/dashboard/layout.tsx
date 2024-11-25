"use client";

import { type ReactNode } from "react";
import { clsx } from "clsx";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useStores } from "@/hooks/useStores";
import { useSocket } from "@/hooks/useSocket";

import { useSettingsStore } from "@/stores/useSettingsStore";

import Menubar from "@/components/Menubar";
import DelayInput from "@/components/DelayInput";

type Props = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
	const stores = useStores();
	const { handleInitial, handleUpdate, maxDelay } = useDataEngine(stores);
	const { connected } = useSocket({ handleInitial, handleUpdate });

	const delay = useSettingsStore((state) => state.delay);
	const syncing = delay > maxDelay;

	useWakeLock();

	return (
		<div className="w-full">
			<div className="flex items-center justify-between gap-4 border-b border-zinc-800 bg-black p-2">
				<Menubar connected={connected} />
				<DelayInput />
			</div>

			{syncing && (
				<div className="flex w-full flex-col items-center justify-center">
					<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
					<p>Please wait for {delay - maxDelay} seconds.</p>
					<p>Or make your delay smaller.</p>
				</div>
			)}

			{!syncing && <div className="h-max w-full">{children}</div>}
		</div>
	);
}
