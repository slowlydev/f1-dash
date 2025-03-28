"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
};

export default function Button({ children, onClick, className }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	// TODO add hover effect
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className={clsx(
				className,
				`rounded-lg p-2 text-center leading-none text-white ${darkMode ? "bg-primary-dark text-white" : "bg-primary-light text-black"}`,
			)}
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
}
