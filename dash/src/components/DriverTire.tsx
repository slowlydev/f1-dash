import React from "react";
import Image from "next/image";
import { Stint } from "../types/driver.type";

type Props = {
  stints: Stint[];
};

export default function DriverTire({ stints }: Props) {
  const stops = stints ? stints.length : 0;
  const currentStint = stints ? stints[stints.length - 1] : null;

  return (
    <div className="flex flex-row items-center gap-2">
      {currentStint ? (
        <Image
          src={`/tires/${currentStint.compound.toLowerCase()}.svg`}
          width={32}
          height={32}
          alt={currentStint.compound}
        />
      ) : (
        <div className="mt-1 h-8 w-8 animate-pulse rounded-md bg-gray-700 font-semibold" />
      )}

      <div>
        <p className="font-bold leading-none">L {currentStint?.laps ?? 0}</p>
        <p className="text-sm font-medium leading-none text-gray-500">
          St {stops}
        </p>
      </div>
    </div>
  );
}
