import { motion } from "framer-motion";

import { DriverType } from "../types/driver.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverRPM from "./DriverRPM";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";

type Props = {
  driver: DriverType;
  position: number;
};

export default function Driver({ driver, position }: Props) {
  const centerClass = "flex flex-row items-center justify-center";

  return (
    <motion.div className="h-18 grid grid-cols-12 items-center py-1" layout>
      <div className={centerClass}>
        <DriverTag driver={driver} position={position} />
      </div>

      <div className={centerClass}>
        <DriverDRS on={driver.drs.on} possible={driver.drs.possible} />
      </div>

      <div className={centerClass}>
        <DriverTire stints={driver.stints} />
      </div>

      <div className="col-span-3 flex items-center justify-around gap-2 pr-4">
        <DriverInfo status={null} laps={driver.laps} />

        <DriverGap
          toFront={driver.gapToFront}
          toLeader={driver.gapToLeader}
          catching={driver.catchingFront}
        />

        <DriverLapTime
          last={driver.lapTimes.last}
          best={driver.lapTimes.best}
        />
      </div>

      <div className="col-span-4">
        <DriverMiniSectors
          sectors={driver.sectors}
          driverDisplayName={driver.short}
        />
      </div>

      <div className={centerClass}>
        <DriverRPM rpm={driver.metrics.rpm} gear={driver.metrics.gear} />

        {/* TODO in dev */}
        {/* <DriverSpeed speed={driver.metrics.speed} /> */}
      </div>
    </motion.div>
  );
}
