"use client";

import { now, utc } from "moment";
import clsx from "clsx";

import { groupSessionByDay } from "@/lib/groupSessionByDay";

import { Session } from "@/types/schedule.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sessions: Session[];
};

export default function WeekendSchedule({ sessions }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div className="grid grid-cols-3 gap-8 pt-2">
			{groupSessionByDay(sessions).map((day, i) => (
				<div className="flex flex-col" key={`next.round.day.${i}`}>
					<p>{utc(day.date).local().format("dddd")}</p>

					<div className="grid grid-rows-2 gap-2">
						{day.sessions.map((session, j) => (
							<div
								className={clsx("flex flex-col", utc(session.end).isBefore(now()) && "opacity-50")}
								key={`next.round.day.${i}.session.${j}`}
							>
								<p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap sm:w-auto">{session.kind}</p>

								<p className={`text-sm leading-none ${darkMode ? "text-tertiary-dark" : "text-tertiary-light"}`}>
									{utc(session.start).local().format("HH:mm")} - {utc(session.end).local().format("HH:mm")}
								</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
