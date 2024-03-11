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
	const { state, position, carData } = useSocket();

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-zinc-800 p-1 p-2 px-2">
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
					<div className={clsx("mb-2 sm:overflow-x-auto md:overflow-visible", " xl:flex-[0,0,auto]")}>
						<LeaderBoard
							drivers={state?.driverList}
							driversTiming={state?.timingData}
							driversAppTiming={state?.timingAppData}
							carData={carData}
						/>
					</div>

					<div className={clsx("flex flex-col divide-y divide-zinc-800", "xl:min-w-0 xl:flex-grow")}>
						{state?.sessionInfo?.type === "Qualifying" && (
							<div className="overflow-x-auto">
								<Qualifying
									drivers={state?.driverList}
									driversTiming={state?.timingData}
									appDriversTiming={state?.timingAppData}
								/>
							</div>
						)}

						<div className="hidden w-full xl:block">
							<Map
								circuitKey={state?.sessionInfo?.meeting.circuit.key}
								positionBatches={position}
								drivers={state?.driverList}
								timingDrivers={state?.timingData}
							/>
						</div>

						<div
							className={clsx(
								"flex w-full flex-col divide-y divide-zinc-800",
								"xl:min-w-0 xl:flex-row xl:divide-x xl:divide-y-0",
							)}
						>
							<div className={clsx("h-96 overflow-y-auto p-2", "xl:w-1/2")}>
								<RaceControl messages={state?.raceControlMessages} utcOffset={state?.sessionInfo?.gmtOffset ?? ""} />
							</div>

							<div className={clsx("h-96 overflow-y-auto p-2", "xl:w-1/2")}>
								<TeamRadios
									sessionPath={state?.sessionInfo?.path}
									drivers={state?.driverList}
									teamRadios={state?.teamRadio}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="xl:hidden">
					<Map
						circuitKey={state?.sessionInfo?.meeting.circuit.key}
						positionBatches={position}
						drivers={state?.driverList}
						timingDrivers={state?.timingData}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}
