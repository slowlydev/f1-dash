"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
	value: number;
	maxValue: number;
	className: string;
};

export default function DriverPedals({ className, value, maxValue }: Props) {
	const progress = value / maxValue;

	return (
		<div className="h-1.5 w-20 overflow-hidden rounded-xl bg-zinc-800">
			<motion.div
				className={clsx("h-1.5", className)}
				style={{ width: `${progress * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
