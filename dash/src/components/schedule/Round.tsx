"use client";
import { now, utc } from "moment";
import clsx from "clsx";

import type { Round as RoundType } from "@/types/schedule.type";

import { groupSessionByDay } from "@/lib/groupSessionByDay";

type Props = {
	round: RoundType;
	nextName: string | undefined;
};

export default function Round({ round, nextName }: Props) {
	const startLocal = utc(round.start).local();
	const endLocal = utc(round.end).local();

	const month =
		startLocal.format("MMMM") === endLocal.format("MMMM")
			? startLocal.format("MMMM")
			: `${startLocal.format("MMM")} - ${endLocal.format("MMM")}`;

	return (
		<div className={clsx(round.over && "opacity-50")}>
			<div className="flex items-center justify-between border-b border-zinc-600 pb-1">
				<div className="flex items-center gap-2">
					<p className="text-2xl">{round.countryName}</p>
					{round.name === nextName && (
						<>
							{utc().local().isBetween(startLocal, endLocal) ? (
								<p className="text-indigo-500">Current</p>
							) : (
								<p className="text-indigo-500">Up Next</p>
							)}
						</>
					)}
					{round.over && <p className="text-red-500">Over</p>}
				</div>

				<div className="flex gap-1">
					<p className="text-xl">{month}</p>

					<p className="text-zinc-600">
						{startLocal.format("D")}-{endLocal.format("D")}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-8 pt-1">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div className="flex flex-col">
						<p>{utc(day.date).local().format("dddd")}</p>

						<div className="grid grid-rows-2 gap-2">
							{day.sessions.map((session, j) => (
								<div
									className={clsx("flex flex-col", !round.over && utc(session.end).isBefore(now()) && "opacity-50")}
									key={`round.day.${i}.session.${j}`}
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
