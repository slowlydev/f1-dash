"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useStores } from "@/hooks/useStores";
import { useSocket } from "@/hooks/useSocket";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

import Sidebar from "@/components/Sidebar";
import SidenavButton from "@/components/SidenavButton";
import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";

type Props = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
	const stores = useStores();
	const { handleInitial, handleUpdate, maxDelay } = useDataEngine(stores);
	const { connected } = useSocket({ handleInitial, handleUpdate });

	useWakeLock();

	const delay = useSettingsStore((state) => state.delay);
	const syncing = delay > maxDelay;

	return (
		<div className="flex h-screen w-full pt-2 pr-2 pb-2">
			<Sidebar key="sidebar" connected={connected} />

			<motion.div
				layout="size"
				className={
					syncing
						? "flex h-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800"
						: "hidden"
				}
			>
				<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
				<p>Please wait for {delay - maxDelay} seconds.</p>
				<p>Or make your delay smaller.</p>
			</motion.div>

			<motion.div layout="size" className={!syncing ? "flex h-full flex-1 flex-col gap-2" : "hidden"}>
				<HeaderBar />

				<div className="flex-1 overflow-scroll rounded-lg border border-zinc-800">{children}</div>
			</motion.div>
		</div>
	);
}

function HeaderBar() {
	const pinned = useSidebarStore((state) => state.pinned);
	const pin = useSidebarStore((state) => state.pin);

	return (
		<div className="grid grid-cols-3 overflow-hidden rounded-lg border border-zinc-800 p-2 px-3">
			<div className="flex items-center gap-2">
				<AnimatePresence>
					{!pinned && <SidenavButton onClick={() => pin()} />}

					<motion.div key="session-info" layout="position">
						<SessionInfo />
					</motion.div>
				</AnimatePresence>
			</div>

			<WeatherInfo />

			<TrackInfo />
		</div>
	);
}
