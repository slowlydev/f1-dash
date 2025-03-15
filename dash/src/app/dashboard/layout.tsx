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
		<div className="flex h-screen w-full md:pt-2 md:pr-2 md:pb-2">
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

			<motion.div layout="size" className={!syncing ? "flex h-full flex-1 flex-col md:gap-2" : "hidden"}>
				<HeaderBar />

				<div className="w-full flex-1 overflow-scroll border-zinc-800 md:rounded-lg md:border">{children}</div>
			</motion.div>
		</div>
	);
}

function HeaderBar() {
	const pinned = useSidebarStore((state) => state.pinned);
	const pin = useSidebarStore((state) => state.pin);
	const open = useSidebarStore((state) => state.open);

	return (
		<div className="grid w-full grid-cols-1 divide-y divide-zinc-800 overflow-hidden border-zinc-800 md:grid-cols-3 md:divide-y-0 md:rounded-lg md:border md:px-3">
			<div className="flex items-center justify-between overflow-hidden p-2 md:hidden">
				{!pinned && <SidenavButton key="mobile" onClick={() => open()} />}

				<TrackInfo />
			</div>

			<div className="flex items-center gap-2 p-2 md:p-0">
				<AnimatePresence>
					{!pinned && <SidenavButton key="desktop" className="hidden md:flex" onClick={() => pin()} />}

					<motion.div key="session-info" layout="position">
						<SessionInfo />
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="p-2 md:flex md:items-center">
				<WeatherInfo />
			</div>

			<div className="hidden p-2 md:flex md:justify-end">
				<TrackInfo />
			</div>
		</div>
	);
}
