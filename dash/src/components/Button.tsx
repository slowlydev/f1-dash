"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
};

export default function Button({ children, onClick, disabled, className }: Props) {
	// TODO add hover effect
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			disabled={disabled}
			className={clsx(className, "rounded-lg bg-zinc-800 p-2 text-center leading-none text-white")}
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
}
