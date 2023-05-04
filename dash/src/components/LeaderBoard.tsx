import { DriverType } from "@/types/driver.type";
import Driver from "./Driver";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

const testData: DriverType[] = [
  {
    name: "George Russel",
    displayName: "RUS",
    drs: {
      on: true,
      possible: true,
    },
    number: 63,
    speed: 300,
    gap: "+0.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD", "PB", "BAD", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["WR", "WR", "WR", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "SOFT",
  },
  {
    name: "Lando Norris",
    displayName: "NOR",
    drs: {
      on: false,
      possible: true,
    },
    number: 15,
    speed: 300,
    gap: "+0.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD", "PB", "BAD", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["WR", "WR", "WR", "WR", "PB", "BAD"],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "SOFT",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "HAM",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 200,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
];

export default function LeaderBoard() {
  const [drivers, setDrivers] = useState<DriverType[]>(testData);

  const testSort = () => {
    setDrivers((oldArray) => {
      const tempArray = [...oldArray];
      tempArray.sort((a, b) => 0.5 - Math.random());
      return tempArray;
    });
  };

  return (
    <div className="mt-5 flex flex-col divide-y divide-gray-500">
      <AnimatePresence>
        {drivers.map((driver, index) => (
          <Driver
            key={`leaderBoard.driver.${driver.displayName}`}
            driver={driver}
            position={index + 1}
          />
        ))}
      </AnimatePresence>

      <button onClick={() => testSort()}>test sort</button>
    </div>
  );
}
