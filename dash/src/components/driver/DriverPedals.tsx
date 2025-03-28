"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	value: number;
	maxValue: number;
	className: string;
};

export default function DriverPedals({ className, value, maxValue }: Props) {
	const progress = value / maxValue;
	const darkMode = useSettingsStore((state) => state.darkMode);

	return (
		<div className={`h-1.5 w-20 overflow-hidden rounded-xl ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}>
			<motion.div
				className={clsx("h-1.5", className)}
				style={{ width: `${progress * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
