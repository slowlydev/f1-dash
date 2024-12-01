"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
	options: { label: string; href: string }[];
};

export default function Dropdown({ options }: Props) {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false);
		}
	};

	if (typeof window !== "undefined") {
		document.addEventListener("mousedown", handleClickOutside);
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-1.5 text-white hover:bg-zinc-700"
			>
				Previous Years
			</button>
			<AnimatePresence>
				{showDropdown && (
					<motion.div
						transition={{ ease: "easeOut", duration: 0.125 }}
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute left-1/2 mt-2 w-48 -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg"
					>
						<ul>
							{options.map((option) => (
								<li key={option.label}>
									<Link href={option.href} className="block rounded-md px-5 py-2 text-white hover:bg-zinc-600">
										{option.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
