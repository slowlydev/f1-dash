"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
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

	const liveRoutes = ["/"]; // adjust this when adding head-to-head or track map
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

	return (
		<div className="flex select-none gap-4 px-2">
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/home")}>
				Home
			</motion.p>
			{/* TODO add spoiler guard (check if race is in progress, then show modal) */}
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => router.push("/")}>
				Dashboard
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/schedule")}>
				Schedule
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/settings")}>
				Settings
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/help")}>
				Help
			</motion.p>

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