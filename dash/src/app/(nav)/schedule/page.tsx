import { Round as RoundType } from "@/types/schedule.type";

import { env } from "@/env.mjs";

import Round from "@/components/schedule/Round";
import NextRound from "@/components/schedule/NextRound";

const getSchedule = async (): Promise<RoundType[]> => {
	try {
		const scheduleReq = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/schedule`, {
			next: {
				revalidate: 3600,
			},
		});
		const schedule: RoundType[] = await scheduleReq.json();
		return schedule;
	} catch (e) {
		return [];
	}
};

export default async function SchedulePage() {
	const schedule = await getSchedule();

	const next = schedule.filter((round) => !round.over)[0] as RoundType | undefined;

	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<div className="my-4">
				<h1 className="text-3xl">Up Next</h1>
				<p className="text-zinc-600">All times are local time</p>
			</div>

			{next ? (
				<NextRound next={next} />
			) : (
				<div className="flex h-40 w-full items-center justify-center">
					<p className="text-zinc-600">no next session found</p>
				</div>
			)}

			<div className="my-4">
				<h1 className="text-3xl">Schedule</h1>
				<p className="text-zinc-600">All times are local time</p>
			</div>

			<div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
				{schedule.map((round, roundI) => (
					<Round nextName={next?.name} round={round} key={`round.${roundI}`} />
				))}
			</div>
		</div>
	);
}
