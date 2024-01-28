import { motion } from "framer-motion";

export default function Navbar() {
	return (
		<div className="flex select-none gap-4">
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Home
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Archive
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Settings
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Windows
			</motion.p>
			<motion.p className="cursor-pointer" whileTap={{ scale: 0.95 }}>
				Help
			</motion.p>
		</div>
	);
}
