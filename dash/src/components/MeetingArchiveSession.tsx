import { utc } from "moment";

import type { ArchiveSession } from "../types/archive.type";

type Props = {
  session: ArchiveSession;
};

export default function MeetingArchiveSession({ session }: Props) {
  return (
    <div className="flex flex-row items-center gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-2 backdrop-blur-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600">
        <p className="text-xl leading-none">{sessionEmoji(session.type)}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="leading-none">{session.name}</p>
        <p className="text-sm leading-none text-gray-400">
          {utc(session.startDate).local().format("LL")}
        </p>
      </div>
    </div>
  );
}

const sessionEmoji = (type: ArchiveSession["type"]): string => {
  switch (type) {
    case "practice":
      return "🏎️";
    case "qualifying":
      return "⏱️";
    case "race":
      return "🏁";
  }
};
