"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

import Fireworks, { FireworksHandlers } from "@fireworks-js/react";

import { useDataStore } from "@/stores/useDataStore";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";
import LeaderBoard from "@/components/LeaderBoard";
import Qualifying from "@/components/Qualifying";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
import LapCount from "@/components/LapCount";

export default function Page() {
	const fireworksRef = useRef<FireworksHandlers>(null);
	const fireworksPlayed = useRef<boolean>(false);

	const sessionType = useDataStore((state) => state.sessionInfo?.type);

	const raceControlMessages = useDataStore((state) => state.raceControlMessages?.messages);

	useEffect(() => {
		if (sessionType === "Race") {
			const chequeredFlagMsg = raceControlMessages?.find((message) => message.flag === "CHEQUERED");
			if (chequeredFlagMsg !== undefined && !fireworksPlayed.current) {
				fireworksRef.current?.start();
				setTimeout(() => {
					fireworksPlayed.current = true;
					fireworksRef.current?.stop();
				}, 30 * 1000);
			}
		}
	}, [raceControlMessages]);

	return (
		<div className="flex w-full flex-col">
			{/* md upwards, desktop ipad design */}
			<div className="hidden flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-zinc-800 p-2 px-2 md:flex">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex w-full items-center justify-between md:w-auto">
						<SessionInfo />
					</div>

					<WeatherInfo />
				</div>

				<TrackInfo />
			</div>

			{/* sm, mobile design */}
			<div className="flex w-full flex-col divide-y divide-zinc-800 border-b border-zinc-800 md:hidden">
				<div className="p-2">
					<SessionInfo />
				</div>

				<div className="p-2">
					<WeatherInfo />
				</div>

				<div className="flex justify-between overflow-hidden p-4">
					<TrackInfo />
					<LapCount />
				</div>
			</div>

			<div className={clsx("flex w-full flex-col divide-y divide-zinc-800")}>
				<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", "xl:flex-row xl:divide-x xl:divide-y-0")}>
					<div className={clsx("mb-2 overflow-x-auto md:overflow-visible", "xl:flex-[0,0,auto]")}>
						<LeaderBoard />
					</div>

					<div className={clsx("flex flex-col divide-y divide-zinc-800", "xl:min-w-0 xl:flex-grow")}>
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
								"2xl:min-w-0 2xl:flex-row 2xl:divide-x 2xl:divide-y-0",
							)}
						>
							<div
								className={clsx(
									"h-96 overflow-y-auto",
									"md:w-1/2",
									"xl:auto xl:mr-0 xl:w-auto xl:flex-grow",
									"2xl:w-1/2",
								)}
							>
								<RaceControl />
							</div>

							<div
								className={clsx(
									"h-96 overflow-y-auto",
									"md:w-1/2",
									"xl:auto xl:mr-0 xl:w-auto xl:flex-grow",
									"2xl:w-1/2",
								)}
							>
								<TeamRadios />
							</div>
						</div>
					</div>
				</div>

				<div className="xl:hidden">
					<Map />
				</div>
			</div>

			<div className="px-2">
				<Footer />
			</div>

			<Fireworks
				ref={fireworksRef}
				autostart={false}
				options={{
					rocketsPoint: { max: 60, min: 40 },
				}}
				style={{
					pointerEvents: "none",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					position: "fixed",
					background: "#00000000",
				}}
			/>
		</div>
	);
}
