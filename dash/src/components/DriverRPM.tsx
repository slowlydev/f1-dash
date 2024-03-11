import { motion } from "framer-motion";

import { clamping, describeArc } from "@/lib/circle";

type Props = {
	rpm: number;
	gear: number;
};

export default function DriverRPM({ rpm, gear }: Props) {
	const progress = rpm / 15000;

	const startAngle = -130;
	const endAngle = 130;

	const finalEndAngle = clamping(progress, 0, 100, endAngle);

	const size = 50;
	const strokeWidth = 5;

	return (
		<div className="flex h-4 w-4 items-center justify-center text-blue-500">
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				width="30"
				height="30"
				viewBox="0 0 50 50"
				fill="none"
				className="absolute"
			>
				<path
					d={describeArc(size / 2, size / 2, size / 2 - strokeWidth / 2, startAngle, finalEndAngle)}
					strokeWidth={strokeWidth}
					className="stroke-blue-500"
					strokeLinecap="round"
				/>
			</motion.svg>

			<p className="absolute z-10 pt-1 font-bold leading-none text-white">{gear}</p>
		</div>
	);
}
