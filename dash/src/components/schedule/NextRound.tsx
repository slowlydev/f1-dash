import { utc } from "moment";

import { env } from "@/env.mjs";

import { Round as RoundType } from "@/types/schedule.type";

import Countdown from "@/components/schedule/Countdown";
import Round from "@/components/schedule/Round";

const getNext = async (): Promise<RoundType | null> => {
	try {
		const nextReq = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/schedule/next`, {
			next: { revalidate: 60 * 60 * 4 },
		});
		const schedule: RoundType = await nextReq.json();
		return schedule;
	} catch (e) {
		return null;
	}
};

export default async function NextRound() {
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
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
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
