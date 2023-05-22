import clsx from "clsx";
import { RaceControlMessage } from "../types/race-control-message.type";

type Props = {
  messages: RaceControlMessage[];
};

export default function RaceControlMessages({ messages }: Props) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {messages.map((msg, index) => (
          <li key={msg.id}>
            <div className="relative pb-8">
              {index !== messages.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white"
                    )}
                  >
                    i
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">{msg.message} </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={msg.time}>{msg.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
