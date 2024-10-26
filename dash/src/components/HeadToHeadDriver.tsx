import Image from "next/image";

import { CarDataChannels, Driver, TimingAppDataDriver, TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import DriverSpeedometer from "./driver/DriverSpeedometer";

type Props = {
	driver: Driver;
	timingDriver: TimingDataDriver;
	timingStatsDriver: TimingStatsDriver | undefined;
	appTimingDriver: TimingAppDataDriver | undefined;
	carData: CarDataChannels | undefined;
};

export default function HeadToHeadDriver({ driver, carData }: Props) {
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
