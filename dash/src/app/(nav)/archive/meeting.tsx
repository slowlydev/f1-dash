import Link from "next/link";
import { utc } from "moment";

import type { Meeting } from "@/types/archive.type";

import { getCountryCode } from "@/lib/country";

import Flag from "@/components/Flag";

type Props = {
	meeting: Meeting;
	year: string;
};

export default function Meeting({ meeting, year }: Props) {
	const start = meeting.sessions[0].startDate;
	const end = meeting.sessions[meeting.sessions.length - 1].endDate;

	return (
		<Link className="rounded-lg border border-zinc-800 p-3" href={`/archive/${year}/${meeting.key}`}>
			<div className="mb-2 flex gap-2">
				<Flag className="h-8 w-11" countryCode={getCountryCode(meeting.country.name)} />
				<p className="flex-1 leading-snug font-bold">{meeting.officialName}</p>
			</div>

			<p className="text-zinc-500">
				{meeting.country.name} - {meeting.location}
			</p>

			<p className="text-zinc-500">
				{utc(start).local().format("MMMM D, YYYY")} - {utc(end).local().format("MMMM D, YYYY")}
			</p>
		</Link>
	);
}
