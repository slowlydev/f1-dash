import { motion } from "framer-motion";

import { DriverType } from "../types/driver.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";

type Props = {
  driver: DriverType;
  position: number;
};

export default function Driver({ driver, position }: Props) {
  return (
    <motion.div className="h-18 grid grid-cols-12 items-center py-2" layout>
      <div>
        <DriverTag driver={driver} position={position} />
      </div>
      <div>
        <DriverDRS on={driver.drs.on} possible={driver.drs.possible} />
      </div>
      <div>
        <DriverGap toFront={driver.gap} toLeader={driver.gap} />
      </div>
      {/* <DriverSpeed speed={driver.speed} /> */}
      <div>
        <DriverTire tire={driver.tire} />
      </div>
      <div className="col-span-5">
        <DriverMiniSectors
          miniSectors={driver.miniSectors}
          driverDisplayName={driver.displayName}
        />
      </div>
      {/* lap */}
    </motion.div>
  );
}
