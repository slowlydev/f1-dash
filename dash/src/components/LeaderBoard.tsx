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
    speed: 250,
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
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "DDD",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "DEV",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "PIA",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "VER",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "BOT",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "PER",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "ZHO",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "TSU",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "ABC",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "DFG",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "HIA",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "DDA",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "LLO",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "BBA",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "ZZO",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "QWE",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
    gap: "+2.12",
    miniSectors: [
      ["PB", "PB", "PB", "WR", "PB", "BAD", "PB", "WR", "PB", "BAD"],
      ["PB", "BAD"],
      [],
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "HARD",
  },
  {
    name: "Lewis Hamiltion",
    displayName: "HUL",
    drs: {
      on: false,
      possible: false,
    },
    number: 44,
    speed: 50,
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
  return (
    <div className="mt-2 flex flex-col divide-y divide-gray-500">
      <AnimatePresence>
        {testData.map((driver, index) => (
          <Driver
            key={`leaderBoard.driver.${driver.displayName}`}
            driver={driver}
            position={index + 1}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
