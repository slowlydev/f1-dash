import { Meeting } from "../types/archive.type";
import Flag from "./Flag";

type Props = {
  meeting: Meeting;
};

export default function ArchiveMeeting({ meeting }: Props) {
  return (
    <div>
      <Flag countryCode={meeting.country.code} />

      <div>
        <p className="truncate text-sm font-medium text-gray-500">
          {meeting.name}
        </p>
        <p>
          {meeting.sessions[0].startDate} -{" "}
          {meeting.sessions[meeting.sessions.length - 1].endDate}
        </p>
      </div>
    </div>
  );
}
