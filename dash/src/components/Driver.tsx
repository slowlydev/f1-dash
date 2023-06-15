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
import DriverSpeed from "./DriverSpeed";

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
        <DriverTire tire={driver.tire} age={10} stops={0} />
      </div>

      <div className="col-span-3 flex items-center gap-2">
        <DriverInfo status={"OUT"} laps={10} />

        <DriverGap toFront={driver.gap} toLeader={driver.gap} />

        <DriverLapTime
          last={{
            time: "1:42.600",
            fastest: false,
            pb: false,
          }}
          best={{
            time: "1:42.352",
            fastest: true,
            pb: true,
          }}
        />
      </div>

      <div className="col-span-4">
        <DriverMiniSectors
          sectors={driver.sectors}
          driverDisplayName={driver.displayName}
        />
      </div>

      <div className={centerClass}>
        <DriverRPM rpm={10000} gear={0} />

        {/* TODO in dev */}
        {/* <DriverSpeed speed={321} /> */}
      </div>
    </motion.div>
  );
}
