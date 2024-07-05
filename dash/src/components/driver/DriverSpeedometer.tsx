import { CarDataChannels } from "@/types/state.type";

import SpeedGauge from "@/components/complications/SpeedGauge";
import AnimatedNumber from "../AnimatedNumber";

type Props = {
	carData: CarDataChannels;
};

export default function DriverSpeedometer({ carData }: Props) {
	return (
		<div className="flex size-60 flex-col items-center justify-center">
			<SpeedGauge
				value={carData[0]}
				min={0}
				max={15000}
				size={240}
				strokeWidth={15}
				guideClassName="stroke-gray-500"
				progressClassName="stroke-blue-500"
			/>

			<SpeedGauge
				value={5}
				min={0}
				max={10}
				startAngle={-130}
				endAngle={80}
				size={190}
				strokeWidth={15}
				guideClassName="stroke-gray-500"
				progressClassName="stroke-emerald-500"
			/>

			<SpeedGauge
				value={!!carData[5] ? 10 : 0}
				min={0}
				max={10}
				startAngle={95}
				endAngle={130}
				size={190}
				strokeWidth={15}
				guideClassName="stroke-gray-500"
				progressClassName="stroke-red-500"
			/>

			<AnimatedNumber className="mt-6 text-6xl tabular-nums">{carData["2"]}</AnimatedNumber>

			<p>km/h</p>

			<AnimatedNumber className="text-xl">{carData["3"]}</AnimatedNumber>
		</div>
	);
}
