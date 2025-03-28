"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import downIcon from "public/icons/chevron-down.svg";

import downIconLight from "public/icons/chevron-down-light.svg";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function ScrollHint() {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<motion.div
			animate={{
				y: [0, 15, 0],
				transition: {
					repeat: Infinity,
					duration: 3.5,
					ease: "backInOut",
				},
			}}
			className="absolute bottom-20 mx-auto"
		>
			<Image alt="down icon" src={darkMode ? downIcon : downIconLight} width={20} height={20} />
		</motion.div>
	);
}
