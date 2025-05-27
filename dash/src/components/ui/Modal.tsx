import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";

type Props = {
	open: boolean;
	children: ReactNode;
};

export default function Modal({ children, open }: Props) {
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
					<div className="fixed inset-0 backdrop-blur-xs transition-opacity" />

					<div className="fixed inset-0 z-40 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								exit={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="relative overflow-hidden rounded-xl bg-zinc-900 p-4 shadow-xl"
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
