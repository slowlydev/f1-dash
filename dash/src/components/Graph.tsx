"use client";

import { motion } from "framer-motion";

const linearScale = (value: number, minIn: number, maxIn: number, minOut: number, maxOut: number): number => {
	const normalizedValue = (value - minIn) / (maxIn - minIn);
	return minOut + normalizedValue * (maxOut - minOut);
};

type Props = {
	values: number[];
	lines?: number;
};

export default function Graph({ lines = 19, values }: Props) {
	const height = 40;
	const safeHight = height - 10;
	const width = lines * 6 - 5; // 6 would be a full, but the last line would be cut

	const maxValue = Math.max(...values);
	const minValue = Math.min(...values);

	const scaleValue = (v: number): number => {
		return linearScale(v, minValue, maxValue, 0, safeHight);
	};

	return (
		<div>
			<motion.svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
			>
				{Array(lines)
					.fill(null)
					.map((_, i) =>
						i % 6 ? (
							<rect x={i * 6} width="1" height={safeHight} className="fill-zinc-800" key={`short.${i}`} />
						) : (
							<rect x={i * 6} width="1" height={height} className="fill-zinc-800" key={`long.${i}`} />
						),
					)}

				{values.length > 0 && (
					<g>
						<motion.path
							layout
							d={`M0 ${scaleValue(values[0])} ${values.map((v, i) => `L${i * 6} ${scaleValue(v)}`).join(" ")} L${values.length * 6} ${scaleValue(values[values.length - 1])} L${values.length * 6} ${height} L0 ${height} Z`}
							fill="url(#green-gradient)"
						/>
						<motion.path
							layout
							d={`M0 ${scaleValue(values[0])} ${values.map((v, i) => `L${i * 6} ${scaleValue(v)}`).join(" ")} L${values.length * 6 + 1} ${scaleValue(values[values.length - 1])}`}
							stroke="#34C85A"
							strokeWidth="1.5"
						/>
					</g>
				)}

				<defs>
					<linearGradient
						id="green-gradient"
						gradientUnits="userSpaceOnUse"
						x1={width / 2}
						y1={0}
						x2={width / 2}
						y2={safeHight}
					>
						<stop offset={0} stopColor="rgb(16, 185, 129)" stopOpacity="0.5" />
						<stop offset={1} stopColor="rgb(16, 185, 129)" stopOpacity="0" />
					</linearGradient>
				</defs>
			</motion.svg>
		</div>
	);
}
