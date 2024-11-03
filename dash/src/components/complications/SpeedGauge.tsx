import { describeArc } from "@/lib/circle";
import { clsx } from "clsx";

type Props = {
	value: number;
	max: number;
	min: number;

	size: number;
	strokeWidth: number;

	startAngle?: number;
	endAngle?: number;

	className?: string;
	guideClassName: string;
	progressClassName: string;
};

export default function SpeedGauge({
	value,
	max,
	min,
	size = 50,
	strokeWidth = 5,
	startAngle = -130,
	endAngle = 130,
	guideClassName,
	progressClassName,
	className,
}: Props) {
	const progress = ((value - min) / (max - min)) * 100;

	const finalEndAngle = startAngle + (endAngle - startAngle) * (progress / 100);

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			fill="none"
			className={clsx("absolute", className)}
		>
			<path
				d={describeArc(size / 2, size / 2, size / 2 - strokeWidth / 2, startAngle, endAngle)}
				strokeWidth={strokeWidth}
				className={guideClassName}
				strokeLinecap="round"
			/>

			<path
				d={describeArc(size / 2, size / 2, size / 2 - strokeWidth / 2, startAngle, finalEndAngle)}
				strokeWidth={strokeWidth}
				className={progressClassName}
				strokeLinecap="round"
			/>
		</svg>
	);
}
