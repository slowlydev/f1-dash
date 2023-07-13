import { AnimatePresence } from "framer-motion";
import { utc } from "moment";

import { sortUtc } from "../lib/sortUtc";

import { RaceControlMessageType } from "../types/race-control-message.type";

import { RaceControlMessage } from "./RaceControlMessage";
import clsx from "clsx";

type Props = {
  messages: RaceControlMessageType[] | undefined;
};

export default function RaceControl({ messages }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {!messages &&
        new Array(7)
          .fill("")
          .map((_, index) => (
            <SkeletonMessage key={`msg.loading.${index}`} index={index} />
          ))}

      {messages && (
        <AnimatePresence>
          {messages.sort(sortUtc).map((msg) => (
            <RaceControlMessage
              key={`msg.${utc(
                msg.utc
              ).unix()}.${msg.message.toLocaleLowerCase()}`}
              msg={msg}
            />
          ))}
        </AnimatePresence>
      )}
    </ul>
  );
}

const SkeletonMessage = ({ index }: { index: number }) => {
  const animateClass = "h-6 animate-pulse rounded-md bg-gray-700";

  const flag = index % 4 === 0;
  const long = index % 5 === 0;
  const mid = index % 3 === 0;

  return (
    <li className="flex flex-col gap-1">
      <div className={clsx(animateClass, "!h-4 w-16")} />

      <div className="flex gap-1">
        {flag && <div className={clsx(animateClass, "w-6")} />}
        <div
          className={animateClass}
          style={{ width: long ? "100%" : mid ? "75%" : "40%" }}
        />
      </div>
    </li>
  );
};
