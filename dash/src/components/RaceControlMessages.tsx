import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { utc } from "moment";

import { RaceControlMessage } from "../types/race-control-message.type";

type Props = {
  messages: RaceControlMessage[] | undefined;
};

export default function RaceControlMessages({ messages }: Props) {
  if (!messages) return null;

  return (
    <ul role="list" className="-mb-8">
      <AnimatePresence>
        {messages
          .filter((v) => !!v)
          .reverse()
          .map((msg, index) => (
            <motion.li key={`rcm.message.${index}`} layout>
              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div className="flex">
                  <p className="text-sm">
                    {msg.message}{" "}
                    <time
                      className="text-sm text-gray-500"
                      dateTime={utc(msg.utc).format("HH:mm:ss")}
                    >
                      {utc(msg.utc).format("HH:mm:ss")}
                    </time>
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
      </AnimatePresence>
    </ul>
  );
}
