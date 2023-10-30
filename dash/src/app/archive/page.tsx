import { env } from "@/env.mjs";

import MeetingArchiveCard from "@/components/MeetingArchiveCard";
import UpNextMeeting from "@/components/UpNext";
import Navbar from "@/components/Navbar";

import type { Archive } from "@/types/archive.type";
import type { NextMeeting } from "@/types/nextMeeting.type";

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

export default async function ArchivePage() {
	const archive = await getArchive();
	const nextMeeting = await getNextMeeting();

	return (
		<div className="container mx-auto mt-10 px-4">
			<Navbar />

			<UpNextMeeting nextMeeting={nextMeeting} />

			<div>
				<h2 className="text-2xl font-semibold">Archive</h2>

				{/* TODO: implement sorting and year change some time */}

				<div className="grid grid-cols-1 divide-y divide-gray-500">
					{archive.meetings.map((meeting, index) => (
						<MeetingArchiveCard key={`meeting.${index}.${meeting.number}`} meeting={meeting} />
					))}
				</div>
			</div>
		</div>
	);
}
