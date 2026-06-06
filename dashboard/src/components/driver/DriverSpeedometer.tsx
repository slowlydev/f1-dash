import type { CarDataChannels } from "@/types/state.type";

import SpeedGauge from "@/components/complications/SpeedGauge";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

type Props = {
	carData: CarDataChannels;
};

export default function DriverSpeedometer({ carData }: Props) {
	const rpm = useAnimatedNumber(carData[0]);
	const throttle = useAnimatedNumber(carData[4]);

	const speed = useAnimatedNumber(carData[2]);

	return (
		<div className="flex size-32 flex-col items-center justify-center">
			<SpeedGauge
				value={rpm}
				min={0}
				max={15000}
				size={128}
				strokeWidth={5}
				guideClassName="stroke-zinc-700"
				progressClassName="stroke-blue-500"
			/>

			<SpeedGauge
				value={throttle}
				min={0}
				max={100}
				startAngle={-130}
				endAngle={80}
				size={110}
				strokeWidth={8}
				guideClassName="stroke-zinc-700"
				progressClassName="stroke-green-400"
			/>

			<SpeedGauge
				value={!!carData[5] ? 10 : 0}
				min={0}
				max={10}
				startAngle={95}
				endAngle={130}
				size={110}
				strokeWidth={8}
				guideClassName="stroke-zinc-700"
				progressClassName="stroke-red-700"
			/>

			{/* TODO add mph convertion peneding on preference */}

			<p className="mt-12 text-2xl tabular-nums">{carData["3"]}</p>

			<p className="text-sm text-zinc-500">km/h</p>

			<p className="text-xl tabular-nums">{speed.toFixed(0)}</p>
		</div>
	);
}
