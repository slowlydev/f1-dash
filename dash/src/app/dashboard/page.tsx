"use client";

import clsx from "clsx";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import Map from "@/components/dashboard/Map";
import TrackViolations from "@/components/dashboard/TrackViolations";

export default function Page() {
	return (
		<div className="flex flex-col gap-2 p-2">
			<div className="flex flex-col gap-2 2xl:flex-row">
				<Card className="w-fit">
					<LeaderBoard />
				</Card>

				<Card className="flex-1">
					<Map />
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-2 *:h-96 *:overflow-y-scroll md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<RaceControl />
				</Card>

				<Card>
					<TeamRadios />
				</Card>

				<Card>
					<TrackViolations />
				</Card>
			</div>
		</div>
	);
}

type Props = {
	children: React.ReactNode;
	className?: string;
};

function Card({ children, className }: Props) {
	return <div className={clsx("rounded-lg border border-zinc-800", className)}>{children}</div>;
}
