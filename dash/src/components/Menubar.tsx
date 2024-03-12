import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

import alertIcon from "../../public/icons/alert-triangle.svg";

import { windows } from "@/lib/windows";

import { useSocket } from "@/context/SocketContext";

import Modal from "./Modal";
import Button from "./Button";

export default function Menubar() {
	const router = useRouter();

	const { openSubWindow } = useSocket();

	const [[liveWarning, nextRoute], setLiveWarning] = useState<[boolean, string | null]>([false, null]);

	const liveRoutes = ["/"]; // adjust this when adding head-to-head or track map

	const liveTimingGuard = (to: string) => {
		if (!liveRoutes.includes(to)) {
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

	const [windowsModal, setWindowsModal] = useState<boolean>(false);

	return (
		<div className="flex select-none gap-4">
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/home")}>
				Home
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/archive")}>
				Archive
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/settings")}>
				Settings
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => liveTimingGuard("/help")}>
				Help
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }} onClick={() => setWindowsModal(true)}>
				Windows
			</motion.p>

			{/* TODO streams o.o */}

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

			<Modal open={windowsModal}>
				<div className="flex flex-col gap-4">
					<p className="text-left">Open Additional Windows</p>

					<div className="grid grid-cols-4 gap-4">
						{windows.map((windowOption, i) => (
							<motion.div
								onClick={() => openSubWindow(windowOption.key)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								key={`window.option.${i}`}
								className=" flex size-40 cursor-pointer flex-col items-start justify-end rounded-lg bg-zinc-800 p-4 text-left"
							>
								<p>{windowOption.label}</p>
							</motion.div>
						))}
					</div>

					<Button onClick={() => setWindowsModal(false)} className="w-24">
						Close
					</Button>
				</div>
			</Modal>
		</div>
	);
}
