import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

import Modal from "./Modal";

import alertIcon from "../../public/icons/alert-triangle.svg";
import Button from "./Button";

export default function Menubar() {
	const router = useRouter();

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
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Windows
			</motion.p>

			{/* TODO streams o.o */}

			<Modal open={liveWarning} onClose={cancelLeaveLive}>
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
