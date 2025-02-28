"use client";

import { motion } from "motion/react";
import Image from "next/image";

import sidebarIcon from "public/icons/sidebar.svg";

type Props = {
	onClick: () => void;
};

export default function SidenavButton({ onClick }: Props) {
	return (
		<motion.button
			onClick={onClick}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0, opacity: 0 }}
			whileTap={{ scale: 0.9 }}
			className="flex size-12 cursor-pointer items-center justify-center"
		>
			<Image src={sidebarIcon} alt="sidebar icon" loading="eager" />
		</motion.button>
	);
}
