import clsx from "clsx";
import React from "react";
import { getTimeColor } from "../lib/getTimeColor";
import { TimeStats } from "../types/driver.type";

type Props = {
  last: TimeStats;
  best: TimeStats;
};

export default function DriverLapTime({ last, best }: Props) {
  return (
    <div>
      <p
        className={clsx(
          "text-sm font-medium leading-none text-gray-500",
          getTimeColor(last.fastest, last.pb),
          !last.value ? "text-gray-500" : ""
        )}
      >
        {!!last.value ? last.value : "-"}
      </p>
      <p
        className={clsx(
          "text-lg font-semibold leading-none",
          getTimeColor(best.fastest, best.pb),
          !best.value ? "text-gray-500" : ""
        )}
      >
        {!!best.value ? best.value : "-"}
      </p>
    </div>
  );
}
