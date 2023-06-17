import React from "react";
import { TireType } from "../types/driver.type";
import Image from "next/image";

type Props = {
  tire: TireType;
  age: number;
  stops: number;
};

export default function DriverTire({ tire, age, stops }: Props) {
  const icon = `/tires/${tire.toLowerCase()}.svg`;

  return (
    <div className="flex flex-row items-center gap-2">
      <Image src={icon} width={32} height={32} alt={tire} />
      <div>
        <p className="font-bold leading-none">L {age}</p>
        <p className="text-sm font-medium leading-none text-gray-500">
          St {stops}
        </p>
      </div>
    </div>
  );
}
