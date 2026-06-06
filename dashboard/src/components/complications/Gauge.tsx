import { clamping, describeArc, polarToCartesian } from "@/lib/circle";

type Props = {
	value: number;
	max: number;
	gradient: "temperature" | "humidity";
};

export default function Gauge({ value, max, gradient }: Props) {
	const startAngle = -130;
	const endAngle = 130;
	const size = 50;
	const strokeWidth = 5;

	const dot = polarToCartesian(
		size / 2,
		size / 2,
		size / 2 - strokeWidth / 2,
		clamping(value, startAngle, endAngle, max),
	);

	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none" className="absolute">
			<defs>
				<linearGradient id="temperature">
					<stop offset="0%" stopColor="#BFDC30" />
					<stop offset="10%" stopColor="#B3FE00" />
					<stop offset="30%" stopColor="#FFE620" />
					<stop offset="60%" stopColor="#FF9500" />
					<stop offset="90%" stopColor="#FA114F" />
				</linearGradient>

				<linearGradient id="humidity">
					<stop offset="0%" stopColor="#01DF6E" />
					<stop offset="10%" stopColor="#55CAF1" />
					<stop offset="30%" stopColor="#4EBCFA" />
					<stop offset="60%" stopColor="#36A6F9" />
					<stop offset="90%" stopColor="#5855D6" />
				</linearGradient>
			</defs>

			<path
				d={describeArc(size / 2, size / 2, size / 2 - strokeWidth / 2, startAngle, endAngle)}
				strokeWidth={strokeWidth}
				stroke={`url(#${gradient})`}
				strokeLinecap="round"
			/>

			<circle cx={dot.x} cy={dot.y} z="10" r="3.5" fill="none" stroke="black" strokeWidth="3" />
		</svg>
	);
}
