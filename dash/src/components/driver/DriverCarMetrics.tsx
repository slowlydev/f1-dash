import { CarDataChannels } from "@/types/state.type";

import DriverPedals from "./DriverPedals";
import { useSpeedPreference } from "@/context/SpeedPreferenceContext";

type Props = {
	carData: CarDataChannels;
};

function convertKmhToMph(kmhValue: number) {
	return Math.floor(kmhValue / 1.609344);
}

export default function DriverCarMetrics({ carData }: Props) {
	const { speedPreference } = useSpeedPreference();
	return (
		<div className="flex items-center gap-2 place-self-start">
			<p className="flex h-8 w-8 items-center justify-center font-mono text-lg">{carData[3]}</p>

			<div>
				<p className="text-right font-mono font-medium leading-none">
					{speedPreference === "km/h" ? carData[2] : convertKmhToMph(carData[2])}
				</p>
				<p className="text-sm leading-none text-zinc-600">{speedPreference}</p>
			</div>

			<div className="flex flex-col">
				<div className="flex flex-col gap-1">
					<DriverPedals className="bg-red-500" value={carData[5]} maxValue={1} />
					<DriverPedals className="bg-emerald-500" value={carData[4]} maxValue={100} />
					<DriverPedals className="bg-blue-500" value={carData[0]} maxValue={15000} />
				</div>
			</div>
		</div>
	);
}
