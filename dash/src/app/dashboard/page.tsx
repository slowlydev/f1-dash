"use client";

import clsx from "clsx";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";

export default function Page() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-2 2xl:flex-row">
				<Card className="w-fit">
					<LeaderBoard />
				</Card>

				<Card className="flex-1">
					<Map />
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-2 *:h-[30rem] *:overflow-y-scroll lg:grid-cols-3">
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
	return <div className={clsx("rounded-lg", className)}>{children}</div>;
}
