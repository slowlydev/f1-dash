import { DriverType } from "@/types/driver.type";
import Driver from "./Driver";
import { AnimatePresence } from "framer-motion";

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
    gap: "+10.120",
    sectors: [
      {
        last: {
          fastest: true,
          pb: false,
          time: "30.022",
        },
        best: {
          fastest: false,
          pb: false,
          time: "30.022",
        },
        segments: [2049, 2051, 2051, 2051, 2051, 2049, 2049, 2049],
      },
      {
        last: {
          fastest: false,
          pb: true,
          time: "30.022",
        },
        best: {
          fastest: false,
          pb: false,
          time: "30.022",
        },
        segments: [2049, 2051, 2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049],
      },
      {
        last: {
          fastest: false,
          pb: false,
          time: "30.022",
        },
        best: {
          fastest: false,
          pb: false,
          time: "30.022",
        },
        segments: [2049, 2051, 2051, 2051, 2051, 2049],
      },
    ],
    lapTimes: [new Date(), new Date(), new Date(), new Date(), new Date()],
    tire: "SOFT",
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
