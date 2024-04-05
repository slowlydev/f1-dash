"use client";

import { now, utc } from "moment";
import clsx from "clsx";

import { Round } from "@/types/schedule.type";

import { groupSessionByDay } from "@/lib/groupSessionByDay";

import Countdown from "@/components/schedule/Countdown";

type Props = {
	next: Round;
};

export default async function NextRound({ next }: Props) {
	const nextStartLocal = utc(next.start).local();
	const nextEndLocal = utc(next.end).local();

	const nextMonth =
		nextStartLocal.format("MMMM") === nextEndLocal.format("MMMM")
			? nextStartLocal.format("MMMM")
			: `${nextStartLocal.format("MMM")} - ${nextEndLocal.format("MMM")}`;

	const nextSession = next.sessions.filter((s) => utc(s.start) > utc())[0];
	const nextRace = next.sessions.find((s) => s.kind.toLowerCase() == "race");

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
			<div className="flex flex-col gap-4">
				{nextSession.kind.toLowerCase() !== "race" && <Countdown next={nextSession} type="other" />}
				{nextRace && <Countdown next={nextRace} type="race" />}
			</div>

			<div>
				<div className="flex items-center justify-between gap-4 border-b border-zinc-600 pb-2">
					<p className="text-2xl">{next.countryName}</p>

					<div className="flex gap-1">
						<p className="text-xl">{nextMonth}</p>

						<p className="text-zinc-600">
							{nextStartLocal.format("D")}-{nextEndLocal.format("D")}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-8 pt-2">
					{groupSessionByDay(next.sessions).map((day, i) => (
						<div className="flex flex-col">
							<p>{utc(day.date).local().format("dddd")}</p>

							<div className="grid grid-rows-2 gap-2">
								{day.sessions.map((session, j) => (
									<div
										className={clsx("flex flex-col", utc(session.end).isBefore(now()) && "opacity-50")}
										key={`next.day.${i}.session.${j}`}
									>
										<p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap sm:w-auto">{session.kind}</p>

										<p className="text-sm leading-none text-zinc-600">
											{utc(session.start).local().format("HH:mm")} - {utc(session.end).local().format("HH:mm")}
										</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
