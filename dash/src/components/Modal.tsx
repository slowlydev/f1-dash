"use client";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, type ReactNode } from "react";

type Props = {
	open: boolean;
	children: ReactNode;
};

export default function Modal({ children, open }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					exit={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="relative z-10"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal
				>
					<div className="fixed inset-0 backdrop-blur-sm transition-opacity" />

					<div className="fixed inset-0 z-40 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								exit={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className={`relative overflow-hidden rounded-xl p-4 shadow-xl ${darkMode ? "bg-modal-dark" : "bg-modal-light"}`}
							>
								{children}
							</motion.div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
