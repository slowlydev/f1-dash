import React from "react";
import { TireType } from "../types/driver.type";
import Image from "next/image";

type Props = {
  tire: TireType;
  age: number;
};

export default function DriverTire({ tire, age }: Props) {
  const icon = `/tires/${tire.toLowerCase()}.svg`;

  return (
    <div className="flex flex-row items-center gap-1">
      <Image src={icon} width={35} height={35} alt={tire} />
      <p className="font-bold">{age}</p>
    </div>
  );
}
