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
      className="flex h-10 w-min flex-row content-center gap-2 rounded-lg p-1"
      style={{ backgroundColor: foundDriver?.color }}
    >
      <div className="flex flex-row content-center px-2">
        <p className="m-0 p-0 text-xl">{position}</p>
      </div>

      <p
        className="flex flex-row content-center rounded-lg bg-white px-2 py-1 font-extrabold"
        style={{ color: foundDriver?.color }}
      >
        {driver?.displayName}
      </p>
    </div>
  );
}
