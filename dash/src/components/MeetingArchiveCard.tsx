import clsx from "clsx";
import { Meeting } from "../types/archive.type";
import Flag from "./Flag";
import MeetingArchiveSession from "./MeetingArchiveSession";

type Props = {
  meeting: Meeting;
};

export default function MeetingArchiveCard({ meeting }: Props) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-4">
        <Flag countryCode={meeting.country.code} />
        <div>
          <p className="truncate text-2xl font-medium">{meeting.name}</p>
          <p className="text-gray-500">{meeting.location}</p>
        </div>
      </div>

      <div
        className={clsx(
          "grid grid-cols-2 gap-2",
          "sm:grid-cols-3",
          "md:grid-cols-4",
          "lg:grid-cols-5"
        )}
      >
        {meeting.sessions.map((session) => (
          <MeetingArchiveSession
            key={`${session.number}.${session.type}`}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
