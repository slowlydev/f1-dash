import React from "react";
import { TireType } from "../types/driver.type";
import Image from "next/image";

type Props = {
  tire: TireType;
};

export default function DriverTire({ tire }: Props) {
  const icon = `/tires/${tire.toLowerCase()}.svg`;

  return (
    <div>
      <Image src={icon} width={40} height={40} alt={tire} />
    </div>
  );
}
