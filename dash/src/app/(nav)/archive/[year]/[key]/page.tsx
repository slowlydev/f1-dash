import Footer from "@/components/Footer"; // Adjust the import path as necessary
import { utc } from "moment";
import { Meeting } from "@/types/archive.type";
import Link from "next/link";
import { env } from "@/env.mjs";

const getArchiveForYear = async (year: string): Promise<Meeting[] | null> => {
	try {
		const nextReq = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/archive/${year}`, {
			next: { revalidate: 60 * 60 * 4 },
		});
		const schedule: Meeting[] = await nextReq.json();
		return schedule;
	} catch (e) {
		return null;
	}
};

export default async function MeetingDetailsPage({ params }: { params: Promise<{ key: string; year: string }> }) {
	const { key, year } = await params;
	const archive = await getArchiveForYear(year);
	const meeting = archive?.find((meet) => meet.key.toString() === key);

	if (!meeting) {
		return (
			<div className="container mx-auto max-w-screen-lg px-4 pb-8">
				<div className="flex h-44 flex-col items-center justify-center">
					<p>No meeting details found for key: {key}</p>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-screen-lg px-4 pb-8">
			<Link href={`/archive/${year}`}>
				<div className="mt-4 text-blue-500 hover:underline">← Back to Year Overview</div>
			</Link>
			<div className="my-4">
				<h1 className="text-3xl font-bold">{meeting.officialName}</h1>
				<p className="text-sm text-zinc-500">{meeting.country.name}</p>
				<p className="mt-1 text-sm italic text-zinc-400">{meeting.location}</p>
				<p className="mt-2 text-sm text-zinc-600">
					{utc(meeting.sessions[0].startDate).local().format("MMMM D, YYYY")} -{" "}
					{utc(meeting.sessions[meeting.sessions.length - 1].endDate)
						.local()
						.format("MMMM D, YYYY")}
				</p>
				<div className="mt-4">
					<h2 className="text-2xl font-bold">Sessions</h2>
					<ul className="mt-2">
						{meeting.sessions.map((session, index) => (
							<li key={index} className="mb-4">
								<h3 className="text-xl font-semibold">{session.name}</h3>
								<p className="text-sm text-zinc-500">{utc(session.startDate).local().format("MMMM D, YYYY")}</p>
								<p className="text-sm text-zinc-500">
									{utc(session.startDate).local().format("HH:mm")} -{utc(session.endDate).local().format("HH:mm")}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
			<Footer />
		</div>
	);
}
