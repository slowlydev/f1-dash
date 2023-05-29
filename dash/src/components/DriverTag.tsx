import { driverLookUp } from "../driver-lookup";
import { DriverType } from "../types/driver.type";

type Props = {
  driver: DriverType;
  position: number;
};

export default function DriverTag({ position, driver }: Props) {
  const foundDriver = driverLookUp.find(
    (driverLU) => driverLU.number === driver.number
  );

  return (
    <div
      className="flex w-20 items-center justify-between gap-0.5 rounded-md p-0.5 px-1 font-black"
      style={{ backgroundColor: foundDriver?.color }}
    >
      <p className="px-1 text-xl">{position}</p>

      <div className="flex h-min w-min items-center justify-center rounded-md bg-white px-1">
        <p style={{ color: foundDriver?.color }}>{driver?.displayName}</p>
      </div>
    </div>
  );
}
