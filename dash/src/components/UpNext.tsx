import clsx from "clsx";
import { NextMeeting } from "../types/nextMeeting.type";
import MeetingSession from "./MeetingSession";

type Props = {
  nextMeeting: NextMeeting;
};

export default function UpNextMeeting({ nextMeeting }: Props) {
  return (
    <div className="mb-4 flex w-full flex-col justify-center">
      <p className="text-xl font-semibold text-gray-500">Up Next</p>
      <p className="mb-4 text-3xl font-bold">{nextMeeting.name} Grand Prix</p>

      <div
        className={clsx(
          "grid grid-cols-2 gap-2",
          "sm:grid-cols-3",
          "md:grid-cols-4",
          "lg:grid-cols-5"
        )}
      >
        {nextMeeting.sessions.map((session, index) => (
          <MeetingSession
            session={session}
            key={`session.${index}.${session.name}`}
          />
        ))}
      </div>
    </div>
  );
}
