"use client";

import clsx from "clsx";

import Map from "@/components/Map";
import WeatherInfo from "@/components/WeatherInfo";
import LeaderBoard from "@/components/LeaderBoard";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";

import Footer from "@/components/Footer";

import { useSocket } from "@/context/SocketContext";

export default function Page() {
	const { state } = useSocket();

	return (
		<div>
			<div className="overflow-x-auto">
				<WeatherInfo weather={state?.weather} />
			</div>

			<div className={clsx("flex flex-col divide-y divide-gray-500", "3xl:flex-row 3xl:divide-x 3xl:divide-y-0")}>
				<div className={clsx("flex flex-col divide-y divide-gray-500", "xl:flex-row xl:divide-x xl:divide-y-0")}>
					<div className={clsx("mb-2 overflow-x-auto", "xl:mr-2 xl:flex-1 xl:overflow-visible")}>
						<LeaderBoard drivers={state?.drivers} />
					</div>
					<div
						className={clsx(
							"flex flex-col divide-y divide-gray-500",
							"sm:flex-row sm:divide-x sm:divide-y-0",
							"xl:flex-1 xl:flex-col xl:divide-x-0 xl:divide-y xl:pl-2",
						)}
					>
						<div
							className={clsx(
								"my-2 h-96 overflow-y-auto",
								"sm:mr-2 sm:w-1/2",
								"xl:auto xl:mr-0 xl:w-auto xl:flex-grow",
							)}
						>
							<RaceControl messages={state?.raceControlMessages} />
						</div>

						<div
							className={clsx(
								"my-2 h-96 overflow-y-auto",
								"sm:w-1/2 sm:pl-2",
								"xl:auto xl:w-auto xl:flex-grow xl:pl-0 xl:pt-2",
							)}
						>
							<TeamRadios teamRadios={state?.teamRadios} />
						</div>
					</div>
				</div>

				<div className={"max-h-screen xl:mt-2 3xl:ml-2 3xl:w-1/2 3xl:flex-grow"}>
					<Map circuitKey={state?.session?.circuitKey} positionBatches={state?.positionBatches} />
				</div>
			</div>

			<Footer />
		</div>
	);
}
