import { DriverType } from "../types/driver.type";

type Props = {
  driver: DriverType;
  position: number;
};

export default function DriverTag({ position, driver }: Props) {
  return (
    <div
      className="flex min-w-[5.5rem]  items-center justify-between gap-0.5 rounded-md p-0.5 px-1 font-black"
      style={{ backgroundColor: `#${driver.teamColor}` }}
    >
      <p className="px-1 text-xl">{position}</p>

      <div className="flex h-min w-min items-center justify-center rounded-md bg-white px-1">
        <p style={{ color: `#${driver.teamColor}` }}>{driver.short}</p>
      </div>
    </div>
  );
}
