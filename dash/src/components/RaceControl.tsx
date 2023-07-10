import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { utc } from "moment";

import { RaceControlMessageType } from "../types/race-control-message.type";
import Image from "next/image";
import { RaceControlMessage } from "./RaceControlMessage";

type Props = {
  messages: RaceControlMessageType[] | undefined;
};

export default function RaceControl({ messages }: Props) {
  if (!messages) return null;

  return (
    <ul role="list">
      <AnimatePresence>
        {messages.reverse().map((msg) => (
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
