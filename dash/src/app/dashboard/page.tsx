"use client";

import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import Qualifying from "@/components/Qualifying";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import Map from "@/components/dashboard/Map";

export default function Page() {
	const sessionType = useDataStore((state) => state.sessionInfo?.type);

	return (
		<div className={clsx("flex w-full flex-col divide-y divide-zinc-800 xl:divide-none")}>
			<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", "xl:flex-row xl:divide-x xl:divide-y-0")}>
				<div className={clsx("mb-2 overflow-x-auto md:overflow-visible", "xl:flex-[0,0,auto]")}>
					<LeaderBoard />
				</div>

				<div className={clsx("flex flex-col divide-y divide-zinc-800", "xl:min-w-0 xl:grow")}>
					{sessionType === "Qualifying" && (
						<div className="overflow-x-auto">
							<Qualifying />
						</div>
					)}

					<div className="hidden w-full xl:block">
						<Map />
					</div>

					<div
						className={clsx(
							"flex w-full flex-col divide-y divide-zinc-800",
							"md:min-w-0 md:flex-row md:divide-x md:divide-y-0",
							"xl:flex-1 xl:flex-col xl:divide-x-0 xl:divide-y",
						)}
					>
						<div className={clsx("h-96 overflow-y-auto", "md:w-1/2", "xl:auto xl:mr-0 xl:w-auto xl:grow")}>
							<RaceControl />
						</div>

						<div className={clsx("h-96 overflow-y-auto", "md:w-1/2", "xl:auto xl:mr-0 xl:w-auto xl:grow")}>
							<TeamRadios />
						</div>
					</div>
				</div>
			</div>

			<div className="xl:hidden">
				<Map />
			</div>
		</div>
	);
}
