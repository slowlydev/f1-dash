import { DriverType } from "@/types/driver.type";
import Driver from "./Driver";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Props = {
  drivers: DriverType[] | undefined;
};

const sortPos = (a: DriverType, b: DriverType) => {
  return parseInt(a.position) - parseInt(b.position);
};

export default function LeaderBoard({ drivers }: Props) {
  return (
    <div className="mt-2 flex flex-col divide-y divide-gray-500 overflow-x-auto">
      <AnimatePresence>
        {!drivers &&
          new Array(20)
            .fill("")
            .map((_, index) => <SkeletonDriver key={index} />)}

        {drivers &&
          drivers
            .sort(sortPos)
            .map((driver, index) => (
              <Driver
                key={`leaderBoard.driver.${driver.short}`}
                driver={driver}
                position={index + 1}
              />
            ))}
      </AnimatePresence>
    </div>
  );
}

const SkeletonDriver = () => {
  const centerClass = "flex flex-row items-center justify-center";

  return (
    <div className="h-18 grid grid-cols-12 items-center gap-1 py-1">
      <div className={centerClass}>
        <div
          className=" h-8 animate-pulse rounded-md bg-gray-700 font-semibold"
          style={{ width: "100%" }}
        />
      </div>

      <div className={centerClass}>
        <div
          className=" h-8 animate-pulse rounded-md bg-gray-700 font-semibold"
          style={{ width: "70%" }}
        />
      </div>

      <div className={clsx(centerClass, "gap-1")}>
        <div className="h-8 w-8 animate-pulse rounded-md bg-gray-700 font-semibold" />

        <div className="h-8 w-10 animate-pulse rounded-md bg-gray-700 font-semibold" />
      </div>

      <div className="col-span-3 flex items-center justify-center gap-1">
        <div className="h-8 w-8 animate-pulse rounded-md bg-gray-700 font-semibold" />

        <div className="flex flex-col gap-1">
          <div className="h-5 w-16 animate-pulse rounded-md bg-gray-700 font-semibold" />
          <div className="h-3 w-16 animate-pulse rounded-md bg-gray-700 font-semibold" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="h-5 w-20 animate-pulse rounded-md bg-gray-700 font-semibold" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-gray-700 font-semibold" />
        </div>
      </div>

      <div className="col-span-4 grid grid-cols-3 gap-x-2 gap-y-1">
        <div className="flex flex-col gap-1">
          <div
            className="h-3 animate-pulse rounded-md bg-gray-700 font-semibold"
            style={{ width: "100%" }}
          />

          <div className="w-30 h-5 animate-pulse rounded-md bg-gray-700 font-semibold" />
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="h-3 animate-pulse rounded-md bg-gray-700 font-semibold"
            style={{ width: "100%" }}
          />

          <div className="w-30 h-5 animate-pulse rounded-md bg-gray-700 font-semibold" />
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="h-3 animate-pulse rounded-md bg-gray-700 font-semibold"
            style={{ width: "100%" }}
          />

          <div className="w-30 h-5 animate-pulse rounded-md bg-gray-700 font-semibold" />
        </div>
      </div>

      <div className={centerClass}>
        <div className="h-8 w-8 animate-pulse rounded-md bg-gray-700 font-semibold" />
      </div>
    </div>
  );
};
