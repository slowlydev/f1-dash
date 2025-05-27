"use client";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import TyreAllocation from "@/components/dashboard/TyreAllocation";
import Map from "@/components/dashboard/Map";
import Footer from "@/components/Footer";
import { useDataStore } from "@/stores/useDataStore";

export default function Page() {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex w-full flex-col gap-2 2xl:flex-row">
				<div className="overflow-x-auto">
					<LeaderBoard />
				</div>

				<div className="flex-1 2xl:max-h-[50rem]">
					<Map />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2 divide-y divide-zinc-800 *:h-[30rem] *:overflow-y-auto *:rounded-lg *:border *:border-zinc-800 *:p-2 md:divide-y-0 lg:grid-cols-2">
				<div className="lg:col-span-2">
					<RaceControl />
				</div>

				<div>
					<TeamRadios />
				</div>

				<div>
					<TrackViolations />
				</div>
			</div>

			<div className="rounded-lg border border-zinc-800 p-4">
				<h2 className="mb-4 text-xl font-semibold">Tyre Allocation</h2>
				<TyreAllocation
					drivers={useDataStore(state => state.driverList) || {}}
					timingData={useDataStore(state => state.timingAppData?.lines) || {}}
				/>
			</div>

			<Footer />
		</div>
	);
}
