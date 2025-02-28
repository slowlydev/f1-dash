"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";

type Props = {
	id?: string;
	className?: string;
	playing: boolean;
	loading?: boolean;
	onClick: () => void;
};

export default function PlayControls({ id, className, playing, loading = false, onClick }: Props) {
	const variants = {
		initial: { opacity: 0, scale: 0.5 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.5 },
	};

	return (
		<div
			id={id}
			className={clsx("flex h-8 w-8 cursor-pointer items-center justify-center", className)}
			onClick={onClick}
		>
			<AnimatePresence>
				{!playing && !loading && (
					<motion.svg
						initial={variants.initial}
						animate={variants.animate}
						exit={variants.exit}
						width="13"
						height="16"
						viewBox="0 0 13 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<motion.path
							d="M12 6.26795C13.3333 7.03775 13.3333 8.96225 12 9.73205L3 14.9282C1.66667 15.698 0 14.7358 0 13.1962L0 2.80385C0 1.26425 1.66667 0.301996 3 1.0718L12 6.26795Z"
							fill="white"
						/>
					</motion.svg>
				)}

				{playing && (
					<motion.svg
						initial={variants.initial}
						animate={variants.animate}
						exit={variants.exit}
						width="10"
						height="14"
						viewBox="0 0 10 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<motion.rect x="7" width="3" height="14" rx="1.5" fill="white" />
						<motion.rect width="3" height="14" rx="1.5" fill="white" />
					</motion.svg>
				)}

				{!playing && loading && (
					<motion.svg
						initial={variants.initial}
						animate={variants.animate}
						exit={variants.exit}
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="#fff"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle className="pulse-loading-spinner" cx="12" cy="12" r="0" />
						<circle className="pulse-loading-spinner" style={{ animationDelay: ".6s" }} cx="12" cy="12" r="0" />
					</motion.svg>
				)}
			</AnimatePresence>
		</div>
	);
}
