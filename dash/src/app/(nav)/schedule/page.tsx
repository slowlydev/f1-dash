import { connection } from "next/server";
import { Suspense } from "react";
import { utc } from "moment";

import { env } from "@/env";

import type { Round as RoundType } from "@/types/schedule.type";

import Countdown from "./countdown";
import Round from "./round";

export const getNext = async () => {
	await connection();

	try {
		const nextReq = await fetch(`${env.API_URL}/api/schedule/next`, {
			cache: "no-store",
		});
		const next: RoundType = await nextReq.json();
		return next;
	} catch (e) {
		console.error("error fetching next round", e);
		return null;
	}
};

export const getSchedule = async () => {
	await connection();

	try {
		const scheduleReq = await fetch(`${env.API_URL}/api/schedule`, {
			cache: "no-store",
		});
		const schedule: RoundType[] = await scheduleReq.json();
		return schedule;
	} catch (e) {
		console.error("error fetching schedule", e);
		return null;
	}
};

export default async function SchedulePage() {
	return (
		<div>
			<div className="my-4">
				<h1 className="text-3xl">Up Next</h1>
				<p className="text-zinc-500">All times are local time</p>
			</div>

			<Suspense fallback={<NextRoundLoading />}>
				<NextRound />
			</Suspense>

			<div className="my-4">
				<h1 className="text-3xl">Schedule</h1>
				<p className="text-zinc-500">All times are local time</p>
			</div>

			<Suspense fallback={<FullScheduleLoading />}>
				<Schedule />
			</Suspense>
		</div>
	);
}

async function NextRound() {
	const next = await getNext();

	if (!next) {
		return (
			<div className="flex h-44 flex-col items-center justify-center">
				<p>No upcomming weekend found</p>
			</div>
		);
	}

	const nextSession = next.sessions.filter((s) => utc(s.start) > utc() && s.kind.toLowerCase() !== "race")[0];
	const nextRace = next.sessions.find((s) => s.kind.toLowerCase() == "race");

	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{nextSession || nextRace ? (
				<div className="flex flex-col gap-4">
					{nextSession && <Countdown next={nextSession} type="other" />}
					{nextRace && <Countdown next={nextRace} type="race" />}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
					<p>No upcomming sessions found</p>
				</div>
			)}

			<Round round={next} />
		</div>
	);
}

async function Schedule() {
	const schedule = await getSchedule();

	if (!schedule) {
		return (
			<div className="flex h-44 flex-col items-center justify-center">
				<p>Schedule not found</p>
			</div>
		);
	}

	const next = schedule.filter((round) => !round.over)[0];

	return (
		<div className="mb-20 grid grid-cols-1 gap-2 md:grid-cols-2">
			{schedule.map((round, roundI) => (
				<Round nextName={next?.name} round={round} key={`round.${roundI}`} />
			))}
		</div>
	);
}

// loading ui

const RoundLoading = () => {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-zinc-800">
			<div className="flex items-center gap-2 border-b border-zinc-800 p-3">
				<div className="h-12 w-16 animate-pulse rounded-md bg-zinc-800" />
				<div className="h-8 flex-1 animate-pulse rounded-md bg-zinc-800" />
			</div>

			<div className="grid grid-cols-3 gap-2 p-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`day.${i}`} className="flex flex-col gap-2">
						<div className="h-8 w-full animate-pulse rounded-md bg-zinc-800" />
						<div className="h-10 w-full animate-pulse rounded-md bg-zinc-800" />
						<div className="h-10 w-full animate-pulse rounded-md bg-zinc-800" />
					</div>
				))}
			</div>
		</div>
	);
};

const NextRoundLoading = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2">
			<div className="flex flex-col gap-4">
				<div className="h-1/2 w-3/4 animate-pulse rounded-md bg-zinc-800" />
				<div className="h-1/2 w-3/4 animate-pulse rounded-md bg-zinc-800" />
			</div>

			<RoundLoading />
		</div>
	);
};

const FullScheduleLoading = () => {
	return (
		<div className="mb-20 grid grid-cols-1 gap-2 md:grid-cols-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<RoundLoading key={`round.${i}`} />
			))}
		</div>
	);
};
