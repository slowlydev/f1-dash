"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
	pedal: "breaks" | "throttle";
	value: number;
	maxValue: number;
};

export default function DriverPedals({ pedal, value, maxValue }: Props) {
	const progress = value / maxValue;

	return (
		<div className="h-1.5 w-20 overflow-hidden rounded-xl bg-gray-800">
			<motion.div
				className={clsx("h-1.5", pedal === "breaks" ? " bg-red-500" : "bg-emerald-500")}
				style={{ width: `${progress * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
