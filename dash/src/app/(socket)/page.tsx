"use client";

import clsx from "clsx";

import { useSocket } from "@/context/SocketContext";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";
import LeaderBoard from "@/components/LeaderBoard";
import Qualifying from "@/components/Qualifying";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import Footer from "@/components/Footer";
import Map from "@/components/Map";

export default function Page() {
	const { state, position } = useSocket();

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-wrap justify-between gap-2 border-b border-zinc-800 bg-zinc-950 p-1 px-2">
				<div className="flex flex-wrap gap-4">
					<SessionInfo session={state?.sessionInfo} clock={state?.extrapolatedClock} />
					<WeatherInfo weather={state?.weatherData} />
				</div>

				<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
			</div>

			<div
				className={clsx("flex w-full flex-col divide-y divide-zinc-800", "3xl:flex-row 3xl:divide-x 3xl:divide-y-0")}
			>
				<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", "xl:flex-row xl:divide-x xl:divide-y-0")}>
					<div className={clsx("mb-2 overflow-x-auto", "xl:flex-1 xl:overflow-visible")}>
						<LeaderBoard
							drivers={state?.driverList}
							driversTiming={state?.timingData}
							driversAppTiming={state?.timingAppData}
						/>
					</div>

					<div
						className={clsx(
							"flex flex-col divide-y divide-zinc-800",
							"xl:flex-shrink-0 xl:flex-col xl:divide-x-0 xl:divide-y",
						)}
					>
						{state?.sessionInfo?.type === "Qualifying" && (
							<div className="h-fit max-w-full overflow-hidden p-2">
								<Qualifying
									drivers={state?.driverList}
									driversTiming={state?.timingData}
									appDriversTiming={state?.timingAppData}
								/>
							</div>
						)}

						<div
							className={clsx(
								"flex flex-col divide-y divide-zinc-800",
								"sm:flex-row sm:divide-x sm:divide-y-0",
								"xl:flex-1 xl:flex-col xl:divide-x-0 xl:divide-y",
							)}
						>
							<div
								className={clsx(
									"h-96 overflow-y-auto p-2",
									"sm:w-1/2 sm:pr-2",
									"xl:auto xl:w-auto xl:flex-grow xl:pr-0",
								)}
							>
								<RaceControl messages={state?.raceControlMessages} />
							</div>

							<div
								className={clsx(
									"h-96 overflow-y-auto p-2",
									"sm:w-1/2 sm:pl-2",
									"xl:auto xl:w-auto xl:flex-grow xl:pl-0 xl:pl-2 xl:pt-2",
								)}
							>
								<TeamRadios
									sessionPath={state?.sessionInfo?.path}
									drivers={state?.driverList}
									teamRadios={state?.teamRadio}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className={"3xl:ml-2 3xl:w-1/2 3xl:flex-grow max-h-screen xl:mt-2"}>
					<Map
						circuitKey={state?.sessionInfo?.meeting.circuit.key}
						positionBatches={position}
						drivers={state?.driverList}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}
