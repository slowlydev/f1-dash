import React from "react";
import { DriverType, MiniSectorStatusType } from "../types/driver.type";
import clsx from "clsx";

type Props = {
  miniSectors: DriverType["miniSectors"];
  driverDisplayName: string;
};

export default function DriverMiniSectors({
  miniSectors,
  driverDisplayName,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-1">
      {miniSectors.map((sector, index) => (
        <div
          key={`sector.${driverDisplayName}.${index}`}
          className="flex flex-col gap-1"
        >
          <div className="flex h-3 flex-row gap-1">
            {sector.map((miniSector, index2) => (
              <MiniSector
                status={miniSector}
                key={`sector.mini.${driverDisplayName}.${index2}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold leading-none">30.200</p>
            <p className="leading-none">30.500</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniSector({ status }: { status: MiniSectorStatusType }) {
  return (
    <div
      className={clsx("h-3 w-3 rounded-[0.2rem]", {
        "bg-yellow-500": status === "BAD",
        "bg-emerald-500": status === "PB",
        "bg-indigo-500": status === "WR",
      })}
    />
  );
}
