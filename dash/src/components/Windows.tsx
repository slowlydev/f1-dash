"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useSocket } from "@/context/SocketContext";

import { windows } from "@/lib/data/windows";

import Modal from "@/components/Modal";
import Button from "@/components/Button";

export default function Windows() {
	const { openSubWindow } = useSocket();

	const [windowsModal, setWindowsModal] = useState<boolean>(false);

	return (
		<>
			<motion.p
				className="cursor-pointer"
				id="walkthrough-windows"
				whileTap={{ scale: 0.95 }}
				onClick={() => setWindowsModal(true)}
			>
				Windows
			</motion.p>

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
		</>
	);
}
