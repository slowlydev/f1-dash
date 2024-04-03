import { utc } from "moment";
import clsx from "clsx";

import { Round } from "@/types/schedule.type";

import { env } from "@/env.mjs";

import { groupSessionByDay } from "@/lib/groupSessionByDay";

import NextRound from "@/components/schedule/NextRound";

const getSchedule = async (): Promise<Round[]> => {
	try {
		const scheduleReq = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/schedule`, {
			next: {
				revalidate: 3600,
			},
		});
		const schedule: Round[] = await scheduleReq.json();
		return schedule;
	} catch (e) {
		return [];
	}
};

export default async function SchedulePage() {
	const schedule = await getSchedule();

	const next = schedule.filter((round) => !round.over)[0] as Round | undefined;

	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<div className="my-10">
				<h1 className="text-3xl font-bold">Up Next</h1>
				<p className="text-zinc-600">All times are local time</p>
			</div>

			{next ? (
				<NextRound next={next} />
			) : (
				<div className=" flex h-40 w-full items-center justify-center">
					<p className="text-zinc-600">no next session found</p>
				</div>
			)}

			<div className="my-10">
				<h1 className="text-3xl font-bold">Schedule</h1>
				<p className="text-zinc-600">All times are local time</p>
			</div>

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
									{round.name === next?.name && <p className="text-indigo-500">Up Next</p>}
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
				})}
			</div>
		</div>
	);
}
