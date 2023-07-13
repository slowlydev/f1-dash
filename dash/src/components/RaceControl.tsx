import { AnimatePresence } from "framer-motion";
import { utc } from "moment";

import { sortUtc } from "../lib/sortUtc";

import { RaceControlMessageType } from "../types/race-control-message.type";

import { RaceControlMessage } from "./RaceControlMessage";

type Props = {
  messages: RaceControlMessageType[] | undefined;
};

export default function RaceControl({ messages }: Props) {
  if (!messages) return null;

  return (
    <ul className="flex flex-col gap-2">
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
    </ul>
  );
}
