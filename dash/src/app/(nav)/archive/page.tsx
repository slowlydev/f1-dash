"use client";

import { env } from "@/env.mjs";

import MeetingArchiveCard from "@/components/MeetingArchiveCard";
import UpNextMeeting from "@/components/UpNext";

import type { Archive } from "@/types/archive.type";
import type { NextMeeting } from "@/types/nextMeeting.type";
import { useEffect, useState } from "react";

const getArchive = async (): Promise<Archive> => {
	const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/archive`, { next: { revalidate: 30 } });
	const res: Archive = await req.json();
	return res;
};

const getNextMeeting = async (): Promise<NextMeeting> => {
	const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/next-meeting`, { next: { revalidate: 30 } });
	const res: NextMeeting = await req.json();
	return res;
};

export default function ArchivePage() {

	const [archive, setArchive] = useState<Archive | null>(null);
	const [nextMeeting, setNextMeeting] = useState<NextMeeting | null>(null);

	useEffect(() => {
		(async () => {
			const meetingData = await getNextMeeting();
			setNextMeeting(meetingData);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const archiveData = await getArchive();
			setArchive(archiveData);
		})();
	}, []);

	return (
		<div className="mt-4">
			{nextMeeting && (
				<UpNextMeeting nextMeeting={nextMeeting} />
			)}

			<div>
				<h2 className="text-2xl font-semibold">Archive</h2>

				<div className="mt-2 w-fit rounded-lg bg-yellow-900 p-2">
					<p>The replay functionality is not implemented. This Page is currenly just for viewing the podium.</p>
				</div>

				{/* TODO: implement sorting and year change some time */}

				<div className="grid grid-cols-1 divide-y divide-gray-500">
					{archive && (
						archive.meetings.map((meeting, index) => (
							<MeetingArchiveCard key={`meeting.${index}.${meeting.number}`} meeting={meeting} />
						))
					)}
				</div>
			</div>
		</div>
	);
}
