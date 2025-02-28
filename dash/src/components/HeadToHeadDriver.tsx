import Image from "next/image";

import type { Driver, TimingDataDriver } from "@/types/state.type";

import { useCarDataStore } from "@/stores/useDataStore";

import DriverSpeedometer from "./driver/DriverSpeedometer";

type Props = {
	driver: Driver;
	timingDriver: TimingDataDriver;
};

export default function HeadToHeadDriver({ driver }: Props) {
	const carData = useCarDataStore((state) =>
		state?.carsData ? state.carsData[driver.racingNumber].Channels : undefined,
	);

	return (
		<div className="p-2">
			<div>
				<Image src={driver.headshotUrl} alt={driver.firstName} width={100} height={100} />

				<div>
					<p>{driver.firstName}</p>
					<p>{driver.lastName}</p>
					<p>{driver.teamName}</p>
				</div>
			</div>

			<div>{carData && <DriverSpeedometer carData={carData} />}</div>
		</div>
	);
}
