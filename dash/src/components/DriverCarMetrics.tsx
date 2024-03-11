import { CarDataChannels } from "@/types/state.type";

import DriverPedals from "./DriverPedals";
import DriverRPM from "./DriverRPM";
import DriverSpeed from "./DriverSpeed";

type Props = {
	carData: CarDataChannels;
};

export default function DriverCarMetrics({ carData }: Props) {
	return (
		<div className="flex gap-1">
			<DriverRPM rpm={carData[0]} gear={carData[3]} />

			<div className="flex flex-col">
				<p className="text-sm">{carData[2]} km/h</p>

				<div className="flex flex-col gap-1">
					<DriverPedals pedal={"breaks"} value={carData[5]} maxValue={1} />
					<DriverPedals pedal={"throttle"} value={carData[4]} maxValue={100} />
				</div>
			</div>
		</div>
	);
}
