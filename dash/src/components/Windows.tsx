"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useWindows } from "@/context/WindowsContext";

import { windows } from "@/lib/data/windows";

import Modal from "@/components/Modal";
import Button from "@/components/Button";

export default function Windows() {
	const { openWindow } = useWindows();

	const [windowsModal, setWindowsModal] = useState<boolean>(false);

	// *note for now we hide windows on small window sizes as they are most likely on a mobile device
	// where the browsers don't support popup windows, it also improves the UI on smaller screens

	return (
		<>
			<motion.p
				className="hidden cursor-pointer sm:block"
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
							<motion.button
								onClick={() => openWindow(windowOption.key)}
								whileHover={{ scale: 1.05 }}
								whileFocus={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								key={`window.option.${i}`}
								className=" flex size-40 cursor-pointer flex-col items-start justify-end rounded-lg bg-zinc-800 p-4 text-left"
							>
								<p>{windowOption.label}</p>
							</motion.button>
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
