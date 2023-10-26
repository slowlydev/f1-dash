"use client";

import { useState } from "react";
import DriverTag from "../../../components/DriverTag";
import HeadToHeadDriver from "../../../components/HeadToHeadDriver";
import { useSocket } from "../../../context/SocketContext";
import { DriverType } from "../../../types/driver.type";

export default function HeadToHeadPage() {
  const { state } = useSocket();

  const [selectedDrivers, setSelectedDrivers] = useState<DriverType[]>([]);

  return (
    <div className="mt-2 w-full">
      {state && state.drivers && (
        <div className="flex gap-2">
          {state.drivers.map((driver) => (
            <div key={`driver.selector.${driver.short}`}>
              <DriverTag teamColor={driver.teamColor} short={driver.short} />
            </div>
          ))}
        </div>
      )}

      {state && state.drivers && (
        <div className="grid grid-cols-2">
          <HeadToHeadDriver driver={state.drivers[0]} />
          <HeadToHeadDriver driver={state.drivers[1]} />
        </div>
      )}
    </div>
  );
}
