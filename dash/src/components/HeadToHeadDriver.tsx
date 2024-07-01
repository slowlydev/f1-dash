import Image from "next/image";

import { CarDataChannels, Driver, TimingAppDataDriver, TimingDataDriver, TimingStatsDriver } from "@/types/state.type";

type Props = {
	driver: Driver;
	timingDriver: TimingDataDriver;
	timingStatsDriver: TimingStatsDriver | undefined;
	appTimingDriver: TimingAppDataDriver | undefined;
	carData: CarDataChannels | undefined;
};

export default function HeadToHeadDriver({ driver, carData }: Props) {
	return (
		<div>
			<div>
				<Image src={driver.headshotUrl} alt={driver.firstName} width={100} height={100} />

				<div>
					<p>{driver.firstName}</p>
					<p>{driver.lastName}</p>
					<p>{driver.teamName}</p>
				</div>
			</div>

			<div>
				{carData && (
					<div>
						<p>{carData[45]}</p>
						<p>{carData[2]}</p>
					</div>
				)}
			</div>
		</div>
	);
}
