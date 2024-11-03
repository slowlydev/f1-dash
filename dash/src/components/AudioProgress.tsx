import { motion } from "framer-motion";

type Props = {
	duration: number;
	progress: number;
};

export default function AudioProgress({ duration, progress }: Props) {
	const percent = progress / duration;

	return (
		<div className="h-1 w-36 overflow-hidden rounded-xl bg-white bg-opacity-50">
			<motion.div
				className="h-1 bg-white"
				style={{ width: `${percent * 100}%` }}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
