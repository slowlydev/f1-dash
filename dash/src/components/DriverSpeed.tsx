import React from "react";

type Props = {
  speed: number;
};

export default function DriverSpeed({ speed }: Props) {
  return (
    <div>
      <p>{speed}</p>
      <p>km/h</p>
    </div>
  );
}
