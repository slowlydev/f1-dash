import { utc } from "moment";
import clsx from "clsx";

import { Round, Session } from "@/types/schedule.type";

import { env } from "@/env.mjs";

import Countdown from "@/components/schedule/Countdown";

const getSchedule = async (): Promise<Round[]> => {
	try {
		const scheduleReq = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/schedule`, {
			next: {
				revalidate: 60 * 60 * 4,
			},
		});
		const schedule: Round[] = await scheduleReq.json();
		return schedule;
	} catch (e) {
		return [];
	}
};

type SessionDayGroup = { date: string; sessions: Session[] };

const groupSessionByDay = (sessions: Session[]): SessionDayGroup[] => {
	return sessions.reduce((groups: SessionDayGroup[], next) => {
		const nextDate = utc(next.start).format("ddddd");
		const groupIndex = groups.findIndex((group) => utc(group.date).format("ddddd") === nextDate);

		if (groupIndex < 0) {
			// not found
			groups = [...groups, { date: next.start, sessions: [next] }];
		} else {
			// found
			groups[groupIndex] = { ...groups[groupIndex], sessions: [...groups[groupIndex].sessions, next] };
		}

		return groups;
	}, []);
};

export default async function SchedulePage() {
	const schedule = await getSchedule();

	const next = schedule.filter((round) => !round.over)[0];

	const nextStartLocal = utc(next.start).local();
	const nextEndLocal = utc(next.end).local();

	const nextMonth =
		nextStartLocal.format("MMMM") === nextEndLocal.format("MMMM")
			? nextStartLocal.format("MMMM")
			: `${nextStartLocal.format("MMM")} - ${nextEndLocal.format("MMM")}`;

	const nextSession = next.sessions.filter((s) => utc(s.start) > utc())[0];
	const nextRace = next.sessions.find((s) => s.kind.toLowerCase() == "race");

	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<h1 className="my-10 text-3xl font-bold">Up Next</h1>
			<p className="text-zinc-600"></p>

			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
				<div className="flex flex-col gap-4">
					{nextSession.kind.toLowerCase() !== "race" && <Countdown next={nextSession} type="other" />}
					{nextRace && <Countdown next={nextRace} type="race" />}
				</div>

				<div>
					<div className="flex items-center justify-between gap-4 border-b border-zinc-600 pb-2">
						<p className="text-3xl">{next.countryName}</p>

						<div className="flex gap-1">
							<p className="text-3xl">{nextMonth}</p>

							<p className="text-zinc-500">
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
										<div className="flex flex-col" key={`next.day.${i}.session.${j}`}>
											<p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap sm:w-auto">{session.kind}</p>

											<p className="text-sm leading-none text-zinc-500">
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

			<h1 className="my-10 text-3xl font-bold">Schedule</h1>

			<div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
				{schedule.map((round, roundI) => {
					const startLocal = utc(round.start).local();
					const endLocal = utc(round.end).local();

					const month =
						startLocal.format("MMMM") === endLocal.format("MMMM")
							? startLocal.format("MMMM")
							: `${startLocal.format("MMM")} - ${endLocal.format("MMM")}`;

					return (
						<div className={clsx(round.over && "opacity-50")} key={`round.${roundI}`}>
							<div className="flex items-center justify-between border-b border-zinc-600 pb-1">
								<div className="flex items-center gap-2">
									<p className="text-2xl font-bold">{round.countryName}</p>
									{round.name === next.name && <p className="text-indigo-500">Up Next</p>}
									{round.over && <p className="text-red-500">Over</p>}
								</div>

								<div className="flex gap-1">
									<p className="text-xl">{month}</p>
									<p className="text-sm leading-none text-zinc-500">
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
												<div className="flex flex-col" key={`round.${roundI}.day.${i}.session.${j}`}>
													<p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap sm:w-auto">
														{session.kind}
													</p>

													<p className="text-sm leading-none text-zinc-500">
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
				})}
			</div>
		</div>
	);
}
