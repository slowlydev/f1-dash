import { motion } from "framer-motion";

import { DriverType } from "../types/driver.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import clsx from "clsx";

type Props = {
  driver: DriverType;
  position: number;
};

export default function Driver({ driver, position }: Props) {
  return (
    <motion.div
      className={clsx("h-18 grid place-items-center items-center gap-1 py-1", {
        "opacity-60": driver.status === "OUT" || driver.status === "RETIRED",
        "bg-indigo-800 bg-opacity-30": driver.lapTimes.best.fastest,
      })}
      style={{
        gridTemplateColumns: "6rem 4rem 4.5rem 4rem 5rem 5rem 20rem auto",
      }}
      layout
    >
      <DriverTag driver={driver} position={position} />

      <DriverDRS on={driver.drs.on} possible={driver.drs.possible} />

      <DriverTire stints={driver.stints} />

      <DriverInfo status={driver.status} laps={driver.laps} />

      <DriverGap
        toFront={driver.gapToFront}
        toLeader={driver.gapToLeader}
        catching={driver.catchingFront}
      />

      <DriverLapTime last={driver.lapTimes.last} best={driver.lapTimes.best} />

      <DriverMiniSectors
        sectors={driver.sectors}
        driverDisplayName={driver.short}
      />

      {/* <DriverRPM rpm={driver.metrics.rpm} gear={driver.metrics.gear} /> */}
    </motion.div>
  );
}
