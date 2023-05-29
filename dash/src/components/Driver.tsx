import { motion } from "framer-motion";

import { DriverType } from "../types/driver.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverRPM from "./DriverRPM";

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

      <div className="col-span-3 flex items-center gap-2">
        <DriverRPM rpm={10000} gear={0} />
        <DriverTire tire={driver.tire} age={10} />
        <DriverGap toFront={driver.gap} toLeader={driver.gap} />
      </div>

      <div className="col-span-6">
        <DriverMiniSectors
          miniSectors={driver.miniSectors}
          driverDisplayName={driver.displayName}
        />
      </div>
    </motion.div>
  );
}
