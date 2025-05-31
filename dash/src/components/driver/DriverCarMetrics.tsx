import { useSettingsStore } from "@/stores/useSettingsStore";

import type { CarDataChannels } from "@/types/state.type";

import DriverPedals from "./DriverPedals";

type Props = {
	carData: CarDataChannels;
};

function convertKmhToMph(kmhValue: number) {
	return Math.floor(kmhValue / 1.609344);
}

export default function DriverCarMetrics({ carData }: Props) {
	const speedUnit = useSettingsStore((state) => state.speedUnit);

	return (
		<div className="flex items-center gap-2 place-self-start">
			<p className="flex h-8 w-8 items-center justify-center font-mono text-lg">{carData[3]}</p>

			<div>
				<p className="text-right font-mono leading-none font-medium">
					{speedUnit === "metric" ? carData[2] : convertKmhToMph(carData[2])}
				</p>
				<p className="text-sm leading-none text-zinc-600">{speedUnit === "metric" ? "km/h" : "mp/h"}</p>
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
