"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Image from "next/image";

import sidebarIcon from "public/icons/sidebar.svg";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useStores } from "@/hooks/useStores";
import { useSocket } from "@/hooks/useSocket";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

import Sidebar from "@/components/Sidebar";
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

	const sidebarStore = useSidebarStore();
	const [sidebarHover, setSidebarHover] = useState<boolean>(false);

	useWakeLock();

	return (
		<div className="relative flex h-screen w-full gap-2 p-2">
			<AnimatePresence>
				{sidebarStore.visiable && (
					<motion.div
						initial={sidebarStore.visiable ? undefined : { x: -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ duration: 0.2, bounce: 0.2, type: "spring" }}
					>
						<Sidebar key="sidebar" connected={connected} />
					</motion.div>
				)}

				{!sidebarStore.visiable && sidebarHover && (
					<motion.div className="fixed top-0 bottom-0 left-0 z-50 h-full p-2" onHoverEnd={() => setSidebarHover(false)}>
						<motion.div
							className="h-full rounded-lg border border-zinc-800 bg-zinc-950 p-2"
							initial={{ x: -300, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -300, opacity: 0 }}
							transition={{ duration: 0.4, bounce: 0.2, type: "spring" }}
						>
							<Sidebar key="sidebar" connected={connected} />
						</motion.div>
					</motion.div>
				)}

				{!sidebarStore.visiable && (
					<motion.div
						key="sidebar-hover"
						onHoverStart={() => setSidebarHover(true)}
						className="fixed top-0 bottom-0 left-0 z-30 h-full w-6"
					/>
				)}

				<SyncGuard maxDelay={maxDelay} key="sync-guard">
					<motion.div layout className="flex h-full flex-1 flex-col gap-2">
						<LayoutGroup>
							<div className="grid grid-cols-3 overflow-hidden rounded-lg border border-zinc-800 p-2 px-3">
								<div className="flex items-center gap-2">
									{!sidebarStore.visiable && (
										<button
											className="flex size-12 cursor-pointer items-center justify-center rounded-lg"
											onClick={() => sidebarStore.open()}
										>
											<Image src={sidebarIcon} alt="sidebar" />
										</button>
									)}

									<SessionInfo />
								</div>

								<WeatherInfo />

								<TrackInfo />
							</div>

							<div className="flex-1 overflow-scroll rounded-lg border border-zinc-800">{children}</div>
						</LayoutGroup>
					</motion.div>
				</SyncGuard>
			</AnimatePresence>
		</div>
	);
}

const SyncGuard = ({ children, maxDelay }: Props & { maxDelay: number }) => {
	const delay = useSettingsStore((state) => state.delay);
	const syncing = delay > maxDelay;

	if (syncing) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-zinc-800">
				<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
				<p>Please wait for {delay - maxDelay} seconds.</p>
				<p>Or make your delay smaller.</p>
			</div>
		);
	}

	return children;
};
