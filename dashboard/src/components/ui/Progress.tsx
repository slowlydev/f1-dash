"use client";

import { motion } from "motion/react";

type Props = {
	duration: number;
	progress: number;
};

export default function Progress({ duration, progress }: Props) {
	const percent = progress / duration;

	return (
		<div className="h-2 w-full max-w-60 overflow-hidden rounded-xl bg-white/50">
			<motion.div
				className="h-2 bg-white"
				style={{ width: `${percent * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
