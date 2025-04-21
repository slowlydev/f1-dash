"use client";

import clsx from "clsx";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";

export default function Page() {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex w-full flex-col gap-2 2xl:flex-row">
				<Card className="overflow-x-auto">
					<LeaderBoard />
				</Card>

				<Card className="flex-1">
					<Map />
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-2 divide-y divide-zinc-600 *:h-[30rem] *:overflow-y-auto lg:grid-cols-3">
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
	return <div className={className}>{children}</div>;
}
