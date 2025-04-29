"use client";

import Image from "next/image";
import { motion } from "motion/react";

import downIcon from "public/icons/chevron-down.svg";

export default function ScrollHint() {
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
			<Image alt="down icon" src={downIcon} width={20} height={20} />
		</motion.div>
	);
}
