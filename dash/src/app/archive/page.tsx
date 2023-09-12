import ArchiveMeeting from "../../components/ArchiveMeeting";
import { env } from "../../env.mjs";
import { Archive } from "../../types/archive.type";

const getArchive = async (): Promise<Archive> => {
  const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/archive`);
  const res: Archive = await req.json();
  return res;
};

export default async function ArchivePage() {
  const archive = await getArchive();

  return (
    <div className="w-full">
      {archive.meetings.map((meeting) => (
        <ArchiveMeeting key={meeting.name} meeting={meeting} />
      ))}
    </div>
  );
}
