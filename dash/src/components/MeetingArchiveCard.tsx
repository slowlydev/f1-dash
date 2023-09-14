import { utc } from "moment";

import { Meeting } from "../types/archive.type";
import Flag from "./Flag";

type Props = {
  meeting: Meeting;
};

export default function MeetingArchiveCard({ meeting }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-2 backdrop-blur-lg">
      <div className="flex gap-2">
        <Flag countryCode={meeting.country.code} />
        <p className="truncate text-sm font-medium text-gray-500">
          {meeting.name}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {meeting.sessions.map((session) => (
          <div className="flex gap-2">
            <p>{session.name}</p>
            <p>{utc(session.startDate).local().format("LL")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
