"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Windows from "@/components/Windows";

import alertIcon from "public/icons/alert-triangle.svg";
import ConnectionStatus from "./ConnectionStatus";

export default function Menubar() {
	const router = useRouter();
	const pathname = usePathname();

	const [[liveWarning, nextRoute], setLiveWarning] = useState<[boolean, string | null]>([false, null]);

	const liveRoutes = ["/dashboard"]; // adjust this when adding head-to-head or track map
	const onLiveRoute = liveRoutes.includes(pathname);

	const liveTimingGuard = (to: string) => {
		// is on live route and wants to navigate to non live
		if (onLiveRoute && !liveRoutes.includes(to)) {
			setLiveWarning([true, to]);
			return;
		}

		router.push(to);
	};

	const confirmLeaveLive = () => {
		if (nextRoute) {
			router.push(nextRoute);
			setLiveWarning([false, null]);
		}
	};

	const cancelLeaveLive = () => {
		setLiveWarning([false, null]);
	};

	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/dashboard");
		router.prefetch("/schedule");
		router.prefetch("/settings");
		router.prefetch("/help");
	}, []);

	return (
		<div className="flex select-none flex-wrap gap-x-4 gap-y-2 px-2" id="walkthrough-menu">
			<motion.a className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/")}>
				Home
			</motion.a>
			{/* TODO add spoiler guard (check if race is in progress, then show modal) */}
			<motion.a className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => router.push("/dashboard")}>
				Dashboard
			</motion.a>
			<motion.a className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/schedule")}>
				Schedule
			</motion.a>
			<motion.a className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/settings")}>
				Settings
			</motion.a>
			<motion.a className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/help")}>
				Help
			</motion.a>

			{onLiveRoute && (
				<div className="flex select-none items-center gap-4">
					<Windows />

					{/* TODO streams o.o */}

					<ConnectionStatus />
				</div>
			)}

			<Modal open={liveWarning}>
				<div className="flex flex-col items-center gap-4">
					<Image alt="warning icon" src={alertIcon} />

					<p>You are leaving Live-Timing!</p>

					<div className="flex flex-row gap-2">
						<Button onClick={cancelLeaveLive} className="w-24">
							Cancel
						</Button>
						<Button onClick={confirmLeaveLive} className="w-24 !bg-red-500">
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
