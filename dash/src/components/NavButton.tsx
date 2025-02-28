"use client";

import { motion } from "motion/react";
import Link from "next/link";

type Props = {
	href: string;
	children: string;
};

export default function NavButton({ href, children }: Props) {
	return (
		<Link href={href}>
			<motion.button whileTap={{ scale: 0.95 }}>{children}</motion.button>
		</Link>
	);
}
