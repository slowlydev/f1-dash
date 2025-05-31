import { notFound } from "next/navigation";
import { connection } from "next/server";

import { env } from "@/env";

import Meeting from "../meeting";
import type { Meeting as MeetingType } from "@/types/archive.type";
import { Suspense } from "react";

const getArchiveForYear = async (year: string) => {
	await connection();

	try {
		const nextReq = await fetch(`${env.API_URL}/api/archive/${year}`, {
			cache: "no-store",
		});
		const schedule: MeetingType[] = await nextReq.json();
		return schedule;
	} catch (e) {
		console.error("error fetching next round", e);
		return null;
	}
};

export default async function ArchivePage({ params }: { params: Promise<{ year: string }> }) {
	const { year } = await params;

	if (year < "2018") notFound();

	return (
		<div>
			<div className="my-4">
				<h1 className="text-3xl">{year} Archive</h1>
				<p className="text-zinc-500">All times are local time</p>
			</div>

			<Suspense fallback={<Loading />}>
				<Meetings year={year} />
			</Suspense>
		</div>
	);
}

const Meetings = async ({ year }: { year: string }) => {
	const meetings = await getArchiveForYear(year);

	if (!meetings) {
		return (
			<div className="flex h-44 flex-col items-center justify-center">
				<p>No archive data found for {year}</p>
			</div>
		);
	}

	return (
		<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
			{meetings.map((meeting) => (
				<Meeting meeting={meeting} key={meeting.key} year={year} />
			))}
		</ul>
	);
};

const Loading = () => {
	return (
		<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
			{Array.from({ length: 10 }).map((_, i) => (
				<MeetingLoading key={`meeting.${i}`} />
			))}
		</ul>
	);
};

const MeetingLoading = () => {
	return (
		<div className="flex flex-col gap-2 rounded-lg border border-zinc-800 p-3">
			<div className="flex gap-2">
				<div className="h-12 w-16 animate-pulse rounded-md bg-zinc-800" />

				<div className="flex flex-1 flex-col gap-1">
					<div className="h-4 w-full animate-pulse rounded-md bg-zinc-800" />
					<div className="h-4 w-1/3 animate-pulse rounded-md bg-zinc-800" />
				</div>
			</div>

			<div className="h-4 w-3/8 animate-pulse rounded-md bg-zinc-800" />

			<div className="h-4 w-4/8 animate-pulse rounded-md bg-zinc-800" />
		</div>
	);
};
