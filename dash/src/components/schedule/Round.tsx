"use client";

import { now, utc } from "moment";
import clsx from "clsx";

import type { Round as RoundType } from "@/types/schedule.type";

import { groupSessionByDay } from "@/lib/groupSessionByDay";
import { formatDayRange, formatMonth } from "@/lib/dateFormatter";

type Props = {
	round: RoundType;
	nextName?: string;
};

export default function Round({ round, nextName }: Props) {
	return (
		<div className={clsx(round.over && "opacity-50")}>
			<div className="flex items-center justify-between border-b border-zinc-600 pb-2">
				<div className="flex items-center gap-2">
					<p className="text-2xl">{round.countryName}</p>
					{round.name === nextName && (
						<>
							{utc().isBetween(utc(round.start), utc(round.end)) ? (
								<p className="text-indigo-500">Current</p>
							) : (
								<p className="text-indigo-500">Up Next</p>
							)}
						</>
					)}
					{round.over && <p className="text-red-500">Over</p>}
				</div>

				<div className="flex gap-1">
					<p className="text-xl">{formatMonth(round.start, round.end)}</p>
					<p className="text-zinc-600">{formatDayRange(round.start, round.end)}</p>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-8 pt-2">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div className="flex flex-col" key={`round.day.${i}`}>
						<p className="my-3 text-xl text-white">{utc(day.date).local().format("dddd")}</p>

						<div className="grid grid-rows-2 gap-2">
							{day.sessions.map((session, j) => (
								<div
									key={`round.day.${i}.session.${j}`}
									className={clsx("flex flex-col", !round.over && utc(session.end).isBefore(now()) && "opacity-50")}
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
	);
}
