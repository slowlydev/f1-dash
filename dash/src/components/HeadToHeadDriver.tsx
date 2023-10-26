import Image from "next/image";

import type { DriverType } from "../types/driver.type";

type Props = {
  driver: DriverType;
};

export default function HeadToHeadDriver({ driver }: Props) {
  return (
    <div>
      <div>
        {/* <Image src={driver} /> */}
        <div>
          <p>
            {driver.firstName} {driver.lastName}
          </p>
          <p>{driver.teamName}</p>
        </div>
      </div>
    </div>
  );
}
