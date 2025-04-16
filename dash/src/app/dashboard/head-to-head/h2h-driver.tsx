import clsx from "clsx";

import { useCarDataStore, useDataStore } from "@/stores/useDataStore";

import DriverTag from "@/components/driver/DriverTag";
import DriverGap from "@/components/driver/DriverGap";
import DriverLapTime from "@/components/driver/DriverLapTime";
import DriverMiniSectors from "@/components/driver/DriverMiniSectors";
import DriverHistoryTires from "@/components/driver/DriverHistoryTires";

import DriverRemove from "./h2h-remove";

type Props = {
	side: "left" | "right";
	driverNr: string;
};

export default function HeadToHeadDriver({ side, driverNr }: Props) {
	const driver = useDataStore((s) => s.driverList?.[driverNr]);
	const timingDriver = useDataStore((s) => s.timingData?.lines?.[driverNr]);
	const timingStatsDriver = useDataStore((s) => s.timingStats?.lines?.[driverNr]);
	const timingAppDriver = useDataStore((s) => s.timingAppData?.lines?.[driverNr]);
	const carData = useCarDataStore((s) => s?.carsData?.[driverNr].Channels);

	const sessionPart = useDataStore((state) => state?.timingData?.sessionPart);

	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	const flexItemsOutside = side === "left" ? "items-start" : "items-end";
	const flexItemsInside = side === "left" ? "items-end" : "items-start";

	const flexRowOutside = side === "left" ? "flex-row" : "flex-row-reverse";
	const flexRowInside = side === "left" ? "flex-row-reverse" : "flex-row";

	if (!driver || !timingDriver || !carData || !timingAppDriver) return <p>loading</p>;

	return (
		<div className={`flex flex-1 flex-col gap-2 p-2 ${flexItemsOutside}`}>
			<div className={`flex w-full items-center justify-between ${flexRowOutside}`}>
				<div
					className={`flex items-center gap-4 rounded-lg p-2 ${flexRowOutside}`}
					style={{ backgroundColor: `#${driver.teamColour}1A` }} // 1A is 10%
				>
					<DriverTag
						className={`!w-20 ${flexRowOutside}`}
						teamColor={driver.teamColour}
						short={driver.tla}
						position={parseInt(timingDriver.position)}
					/>

					<p className="px-2 text-lg">
						{driver.firstName} {driver.lastName}
					</p>
				</div>

				<DriverRemove number={side === "left" ? "first" : "second"} />
			</div>

			<div className={`flex w-full gap-2 ${flexRowInside}`}>
				{/* inside */}

				<div className="flex flex-col gap-2">
					<Card className={`flex flex-row gap-2 ${flexRowOutside} justify-end`}>
						<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
						<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={hasFastest} />
					</Card>

					<Card>
						<DriverMiniSectors sectors={timingDriver.sectors} bestSectors={timingStatsDriver?.bestSectors} />
					</Card>
				</div>

				{/* outside */}

				<div className={`flex flex-wrap gap-2 ${flexRowOutside} *:flex-1`}>
					<Card className="flex flex-row gap-2">
						<DriverHistoryTires stints={timingAppDriver.stints} />
					</Card>

					<Card>somethingsomething</Card>

					<Card>somethingsomething</Card>

					<Card>somethingsomething</Card>

					<Card>somethingsomething</Card>

					<Card>somethingsomething more</Card>

					<Card>some else more</Card>
				</div>
			</div>
		</div>
	);
}

type CardProps = {
	children: React.ReactNode;
	className?: string;
};

function Card({ children, className }: CardProps) {
	return <div className={clsx("rounded-lg border border-zinc-800 p-2", className)}>{children}</div>;
}
