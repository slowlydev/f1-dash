"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import githubIcon from "public/icons/github.svg";
import coffeeIcon from "public/icons/bmc-logo.svg";
import coffeeIconLight from "public/icons/bmc-logo-light.svg";
import githubIconLight from "public/icons/github-light.svg";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	icon: "github" | "bmc";
	href: string;
	children: string;
};

export default function IconLabelButton({ icon, href, children }: Props) {
	const settings = useSettingsStore();

	return (
		<a target="_blank" href={href}>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="flex cursor-pointer select-none items-center gap-2"
			>
				<Image
					src={
						icon === "bmc"
							? settings.darkMode
								? coffeeIcon
								: coffeeIconLight
							: settings.darkMode
								? githubIcon
								: githubIconLight
					}
					alt={icon}
					width={20}
					height={20}
				/>
				<p>{children}</p>
			</motion.div>
		</a>
	);
}
