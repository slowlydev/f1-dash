import React from "react";
import { DriverType, MiniSectorStatusType } from "../types/driver.type";
import clsx from "clsx";

type Props = {
  miniSectors: DriverType["miniSectors"];
};

export default function DriverMiniSectors({ miniSectors }: Props) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-1">
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {miniSectors.map((sector, index) => (
          <div
            key={`sector.${index}`}
            className="col-span-4 flex flex-row gap-1"
          >
            {sector.map((miniSector, index2) => (
              <MiniSector status={miniSector} key={`sector.mini.${index2}`} />
            ))}
          </div>
        ))}
      </div>

      <div className="col-span-4 flex items-center gap-2">
        <p className="text-lg font-semibold">30.200</p>
        <p>30.500</p>
      </div>

      <div className="col-span-4 flex items-center gap-2">
        <p className="text-lg font-semibold">30.200</p>
        <p>30.500</p>
      </div>

      <div className="col-span-4 flex items-center gap-2">
        <p className="text-lg font-semibold">30.200</p>
        <p>30.500</p>
      </div>
    </div>
  );
}

function MiniSector({ status }: { status: MiniSectorStatusType }) {
  return (
    <div
      className={clsx("h-4 w-4 rounded-md", {
        "bg-yellow-500": status === "BAD",
        "bg-emerald-500": status === "PB",
        "bg-indigo-500": status === "WR",
      })}
    />
  );
}
