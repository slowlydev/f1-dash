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
    <div className="flex flex-row items-center gap-1">
      <Image src={icon} width={35} height={35} alt={tire} />
      <div>
        <p className="font-bold">L {age}</p>
        <p className="text-sm font-medium leading-none text-gray-500">
          S {stops}
        </p>
      </div>
    </div>
  );
}
