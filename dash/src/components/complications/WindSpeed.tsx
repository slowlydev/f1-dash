import { getWindDirection } from "@/lib/getWindDirection";

type Props = {
	speed: number;
	directionDeg: number;
};

export default function WindSpeedComplication({ speed, directionDeg }: Props) {
	return (
		<div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-black">
			<div className="flex flex-col items-center">
				<p className="text-center text-[10px] font-medium leading-none text-blue-400">
					{getWindDirection(directionDeg)}
				</p>

				<p className="text-xl font-medium leading-none text-white">{speed}</p>

				<p className="text-center text-[10px] font-medium leading-none text-white">m/s</p>
			</div>
		</div>
	);
}
