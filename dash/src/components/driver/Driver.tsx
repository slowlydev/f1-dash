"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

import { useMode } from "@/context/ModeContext";

import {
	Driver as DriverType,
	TimingDataDriver,
	TimingAppDataDriver,
	CarDataChannels,
	TimingStatsDriver,
} from "@/types/state.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import DriverCarMetrics from "./DriverCarMetrics";

type Props = {
	position: number;
	sessionPart: number | undefined;
	driver: DriverType;
	timingDriver: TimingDataDriver;
	timingStatsDriver: TimingStatsDriver | undefined;
	appTimingDriver: TimingAppDataDriver | undefined;
	carData: CarDataChannels | undefined;
};

const hasDRS = (drs: number) => {
	return drs > 9;
};

const possibleDRS = (drs: number) => {
	return drs === 8;
};

export default function Driver({
	driver,
	timingDriver,
	timingStatsDriver,
	appTimingDriver,
	position,
	sessionPart,
	carData,
}: Props) {
	const { uiElements } = useMode();

	// const [open, setOpen] = useState<boolean>(false);

	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	return (
		<motion.div
			layout="position"
			// onClick={() => setOpen((old) => !old)}
			className={clsx("flex select-none flex-col gap-1 p-1.5", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-violet-800 bg-opacity-30": hasFastest,
				"bg-red-800 bg-opacity-30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				className={clsx("grid items-center gap-2")}
				style={{
					gridTemplateColumns: uiElements.carMetrics
						? "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto auto"
						: "5.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto",
				}}
			>
				<DriverTag className="!min-w-full" short={driver.tla} teamColor={driver.teamColour} position={position} />
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.inPit}
					pitOut={timingDriver.pitOut}
				/>
				<DriverTire stints={appTimingDriver?.stints} />
				<DriverInfo timingDriver={timingDriver} gridPos={appTimingDriver ? parseInt(appTimingDriver.gridPos) : 0} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={hasFastest} />
				<DriverMiniSectors
					sectors={timingDriver.sectors}
					bestSectors={timingStatsDriver?.bestSectors}
					tla={driver.tla}
					showFastest={uiElements.sectorFastest}
				/>

				{uiElements.carMetrics && carData && <DriverCarMetrics carData={carData} />}
			</div>

			{/* <AnimatePresence>
				{open && appTimingDriver && (
					<DriverDetailed
						racingNumber={driver.racingNumber}
						timingDriver={timingDriver}
						history={history}
						appTimingDriver={appTimingDriver}
					/>
				)}
			</AnimatePresence> */}
		</motion.div>
	);
}

const inDangerZone = (position: number, sessionPart: number) => {
	switch (sessionPart) {
		case 1:
			return position > 15;
		case 2:
			return position > 10;
		case 3:
		default:
			return false;
	}
};
