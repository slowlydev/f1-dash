import { motion } from "framer-motion";
import React from "react";

type Props = {
	speed: number;
};

export default function DriverSpeed({ speed }: Props) {
	return (
		<div className="flex items-center justify-center gap-2 text-emerald-500">
			<motion.svg className="h-9 w-9" viewBox="0 0 172 150" fill="none" xmlns="http://www.w3.org/2000/svg">
				<motion.path
					d="M32.5 139.979C18.6057 126.207 10 107.109 10 86C10 44.0264 44.0264 10 86 10C127.974 10 162 44.0264 162 86C162 106.865 153.592 125.766 139.979 139.5"
					stroke="currentColor"
					strokeWidth="20"
					strokeLinecap="round"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: speed / 400 }}
				/>
			</motion.svg>

			<p className="font-bold leading-none text-white">{speed}</p>
		</div>
	);
}
