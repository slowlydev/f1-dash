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
			<div className="flex flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-zinc-800 bg-zinc-950 p-1 px-2">
				<div className="flex flex-wrap gap-2">
					<div className="flex w-full items-center justify-between md:w-auto">
						<SessionInfo session={state?.sessionInfo} clock={state?.extrapolatedClock} />
						<div className="block md:hidden">
							<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
						</div>
					</div>
					<WeatherInfo weather={state?.weatherData} />
				</div>

				<div className="hidden md:block">
					<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
				</div>
			</div>

			<div className={clsx("flex w-full flex-col divide-y divide-zinc-800")}>
				<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", "xl:flex-row xl:divide-x xl:divide-y-0")}>
					<div className={clsx("mb-2 overflow-x-auto", "xl:flex-[10,1,auto] xl:overflow-visible")}>
						<LeaderBoard
							drivers={state?.driverList}
							driversTiming={state?.timingData}
							driversAppTiming={state?.timingAppData}
						/>
					</div>

					<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", " xl:flex-grow")}>
						{/* disabled for now, needs de-synced state */}
						{state?.sessionInfo?.type === "Qualifying" && false && (
							<div className="overflow-x-auto">
								<div className="h-fit w-fit">
									<Qualifying
										drivers={state?.driverList}
										driversTiming={state?.timingData}
										appDriversTiming={state?.timingAppData}
									/>
								</div>
							</div>
						)}

						<div className={clsx("flex w-full flex-col divide-y divide-zinc-800")}>
							<div className={clsx("h-96 overflow-y-auto p-2")}>
								<RaceControl messages={state?.raceControlMessages} />
							</div>

							<div className={clsx("h-96 overflow-y-auto p-2")}>
								<TeamRadios
									sessionPath={state?.sessionInfo?.path}
									drivers={state?.driverList}
									teamRadios={state?.teamRadio}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className={"max-h-screen"}>
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
