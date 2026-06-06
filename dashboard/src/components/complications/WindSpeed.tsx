import { getWindDirection } from "@/lib/getWindDirection";

type Props = {
	speed: number;
	directionDeg: number;
};

export default function WindSpeedComplication({ speed, directionDeg }: Props) {
	return (
		<div className="relative flex h-[55px] w-[55px] items-center justify-center rounded-full bg-black">
			<div className="flex flex-col items-center">
				<p className="text-center text-[10px] leading-none font-medium text-blue-400">
					{getWindDirection(directionDeg)}
				</p>

				<p className="text-xl leading-none font-medium text-white">{speed}</p>

				<p className="text-center text-[10px] leading-none font-medium text-white">m/s</p>
			</div>
		</div>
	);
}
