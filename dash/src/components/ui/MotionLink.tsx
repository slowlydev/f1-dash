"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";

type Props = {
	href: string;
	children: ReactNode;
	className?: string;
	target?: string;
};

export default function MotionLink({ href, children, className, target }: Props) {
	return (
		<Link href={href} legacyBehavior passHref>
			<motion.a whileTap={{ scale: 0.95 }} className={className} target={target}>
				{children}
			</motion.a>
		</Link>
	);
}
