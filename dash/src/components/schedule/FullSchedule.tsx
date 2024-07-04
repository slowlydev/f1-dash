import { env } from "@/env.mjs";

import { Round as RoundType } from "@/types/schedule.type";

import Round from "@/components/schedule/Round";

const getSchedule = async () => {
	try {
		const scheduleReq = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/schedule`, {
			next: { revalidate: 60 * 60 * 4 },
		});
		const schedule: RoundType[] = await scheduleReq.json();
		return schedule;
	} catch (e) {
		return null;
	}
};

export default async function FullSchedule() {
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
		<div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
			{schedule.map((round, roundI) => (
				<Round nextName={next?.name} round={round} key={`round.${roundI}`} />
			))}
		</div>
	);
}
