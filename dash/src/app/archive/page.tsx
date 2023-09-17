import { utc } from "moment";
import MeetingArchiveCard from "../../components/MeetingArchiveCard";

import { env } from "../../env.mjs";

import { Archive, ArchiveSession } from "../../types/archive.type";
import { NextMeeting } from "../../types/nextMeeting.type";
import Dropdown from "../../components/Dropdown";
import MeetingArchiveSession from "../../components/MeetingArchiveSession";
import clsx from "clsx";

const getArchive = async (): Promise<Archive> => {
  const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/archive`);
  const res: Archive = await req.json();
  return res;
};

const getNextMeeting = async (): Promise<NextMeeting> => {
  const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/next-meeting`);
  const res: NextMeeting = await req.json();
  return res;
};

// const currentYear = new Date().getFullYear();
// const years = Array.from(
//   { length: currentYear - 2012 },
//   (_, i) => currentYear - i
// );

export default async function ArchivePage() {
  const archive = await getArchive();
  const nextMeeting = await getNextMeeting();

  return (
    <div className="container mx-auto px-4">
      <div>
        <h1 className="text-2xl font-semibold">Up Next</h1>

        <div>
          <p className="text-3xl font-bold">{nextMeeting.name}</p>

          <div
            className={clsx(
              "grid grid-cols-2 gap-2",
              "sm:grid-cols-3",
              "md:grid-cols-4",
              "lg:grid-cols-5"
            )}
          >
            {nextMeeting.sessions.map((session) => {
              const archiveSession: ArchiveSession = {
                ...session,
                key: 0,
                type: "practice",
                path: "",
              };

              return <MeetingArchiveSession session={archiveSession} />;
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Archive</h2>

        {/* TODO: implement sorting and year change some time */}

        {/* <div>
          <Dropdown label="Year" options={years} />
          <Dropdown label="Order" options={["Newest first", "Oldest first"]} />
        </div> */}

        <div className="grid grid-cols-1 divide-y divide-gray-500">
          {archive.meetings.map((meeting) => (
            <MeetingArchiveCard key={meeting.name} meeting={meeting} />
          ))}
          d
        </div>
      </div>
    </div>
  );
}
