"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";

import sidebarIcon from "public/icons/sidebar.svg";

type Props = {
	className?: string;
	onClick: () => void;
};

export default function SidenavButton({ className, onClick }: Props) {
	return (
		<motion.button
			onClick={onClick}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0, opacity: 0 }}
			whileTap={{ scale: 0.9 }}
			className={clsx("flex size-12 cursor-pointer items-center justify-center", className)}
		>
			<Image src={sidebarIcon} alt="sidebar icon" loading="eager" />
		</motion.button>
	);
}
