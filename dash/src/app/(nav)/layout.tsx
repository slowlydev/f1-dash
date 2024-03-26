"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import Image from "next/image";

import Menubar from "@/components/Menubar";

import githubIcon from "public/icons/github.svg";
import coffeeIcon from "public/icons/bmc-logo.svg";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div>
			<div className="sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 bg-black p-2">
				<Menubar />

				<div className="flex items-center gap-4 pr-2">
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex cursor-pointer select-none items-center gap-2"
					>
						<Image src={coffeeIcon} alt="github" width={20} height={20} />
						<p className="opacity-50">Coffee</p>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex cursor-pointer select-none items-center gap-2"
					>
						<Image src={githubIcon} alt="github" width={25} height={25} />
						<p className="opacity-50">Github</p>
					</motion.div>
				</div>
			</div>

			{children}
		</div>
	);
}
