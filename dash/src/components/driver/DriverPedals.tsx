"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
	value: number;
	maxValue: number;
	className: string;
	tooltip?: string;
};

export default function DriverPedals({ className, value, maxValue, tooltip }: Props) {
	const progress = value / maxValue;

	return (
		<div
			className="h-1.5 w-20 overflow-hidden rounded-xl bg-zinc-800"
			data-tooltip-id="tooltip"
			data-tooltip-content={tooltip}
		>
			<motion.div
				className={clsx("h-1.5", className)}
				style={{ width: `${progress * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
