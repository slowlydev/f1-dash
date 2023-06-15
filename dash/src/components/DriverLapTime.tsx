import clsx from "clsx";
import React from "react";
import { getTimeColor } from "../lib/getTimeColor";

type Props = {
  last: {
    time: string;
    fastest: boolean;
    pb: boolean;
  };
  best: {
    time: string;
    fastest: boolean;
    pb: boolean;
  };
};

export default function DriverLapTime({ last, best }: Props) {
  return (
    <div>
      <p
        className={clsx(
          "text-lg font-semibold leading-none",
          getTimeColor(best.fastest, best.pb)
        )}
      >
        {best.time}
      </p>
      <p
        className={clsx(
          "text-sm font-medium leading-none text-gray-500",
          getTimeColor(last.fastest, last.pb)
        )}
      >
        {last.time}
      </p>
    </div>
  );
}
