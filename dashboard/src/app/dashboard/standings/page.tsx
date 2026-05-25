"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type DriverStanding = {
	position: string;
	points: string;
	Driver: {
		givenName: string;
		familyName: string;
		permanentNumber: string;
	};
	Constructors: {
		constructorId: string;
		name: string;
	}[];
};

type ConstructorStanding = {
	position: string;
	points: string;
	Constructor: {
		constructorId: string;
		name: string;
	};
};

const logoMapper: Record<string, string> = {
	red_bull: "red-bull-racing",
	mercedes: "mercedes",
	ferrari: "ferrari",
	mclaren: "mclaren",
	alpine: "alpine",
	rb: "racing-bulls",
	haas: "haas-f1-team",
	williams: "williams",
	aston_martin: "aston-martin",
	kick_sauber: "kick-sauber",
	sauber: "kick-sauber",
	alfa: "kick-sauber",
};

const getLogoFileName = (constructorId: string) => {
	const mapped = logoMapper[constructorId.toLowerCase()];
	return mapped || constructorId.toLowerCase();
};

export default function Standings() {
	const [driverStandings, setDriverStandings] = useState<DriverStanding[] | null>(null);
	const [teamStandings, setTeamStandings] = useState<ConstructorStanding[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStandings = async () => {
			try {
				const [driversRes, constructorsRes] = await Promise.all([
					fetch("https://api.jolpi.ca/ergast/f1/current/driverstandings.json"),
					fetch("https://api.jolpi.ca/ergast/f1/current/constructorstandings.json"),
				]);

				if (!driversRes.ok || !constructorsRes.ok) throw new Error("Failed to fetch data");

				const driversData = await driversRes.json();
				const constructorsData = await constructorsRes.json();

				setDriverStandings(driversData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []);
				setTeamStandings(constructorsData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []);
			} catch (err) {
				setError("Failed to load championship standings");
				console.error(err);
			}
		};

		fetchStandings();
	}, []);

	return (
		<div className="grid h-full grid-cols-1 divide-y divide-zinc-800 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
			<div className="h-full p-4">
				<h2 className="text-xl">Driver Championship Standings</h2>

				{error && <p className="mt-4 text-red-500">{error}</p>}

				<div className="divide flex flex-col divide-y divide-zinc-800">
					{!driverStandings &&
						!error &&
						new Array(20).fill("").map((_, index) => <DriverSkeletonItem key={`driver.loading.${index}`} />)}

					{driverStandings &&
						driverStandings.map((driver) => {
							return (
								<div
									className="grid items-center p-2"
									style={{
										gridTemplateColumns: "2rem 1fr 4rem",
									}}
									key={driver.Driver.permanentNumber || driver.Driver.familyName}
								>
									<p className="font-bold">{driver.position}</p>

									<p className="truncate">
										{driver.Driver.givenName} {driver.Driver.familyName}
									</p>

									<p className="text-right whitespace-nowrap">{driver.points} pts</p>
								</div>
							);
						})}
				</div>
			</div>

			<div className="h-full p-4">
				<h2 className="text-xl">Team Championship Standings</h2>

				{error && <p className="mt-4 text-red-500">{error}</p>}

				<div className="divide flex flex-col divide-y divide-zinc-800">
					{!teamStandings &&
						!error &&
						new Array(10).fill("").map((_, index) => <TeamSkeletonItem key={`team.loading.${index}`} />)}

					{teamStandings &&
						teamStandings.map((team) => (
							<div
								className="grid items-center gap-2 p-2"
								style={{
									gridTemplateColumns: "2rem 24px 1fr 4rem",
								}}
								key={team.Constructor.constructorId}
							>
								<p className="font-bold">{team.position}</p>

								<Image
									src={`/team-logos/${getLogoFileName(team.Constructor.constructorId)}.svg`}
									alt={team.Constructor.name}
									width={24}
									height={24}
									className="overflow-hidden rounded-lg object-contain"
									onError={(e) => {
										// Fallback if image not found
										(e.currentTarget as HTMLImageElement).style.visibility = "hidden";
									}}
								/>

								<p className="truncate">{team.Constructor.name}</p>

								<p className="text-right whitespace-nowrap">{team.points} pts</p>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

const DriverSkeletonItem = () => {
	return (
		<div
			className="grid items-center gap-2 p-2"
			style={{
				gridTemplateColumns: "2rem auto 4rem",
			}}
		>
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-32 animate-pulse rounded-md bg-zinc-800" />
			<div className="ml-auto h-4 w-12 animate-pulse rounded-md bg-zinc-800" />
		</div>
	);
};

const TeamSkeletonItem = () => {
	return (
		<div
			className="grid items-center gap-2 p-2"
			style={{
				gridTemplateColumns: "2rem 24px auto 4rem",
			}}
		>
			<div className="h-4 w-4 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-6 w-6 animate-pulse rounded-md bg-zinc-800" />
			<div className="h-4 w-32 animate-pulse rounded-md bg-zinc-800" />
			<div className="ml-auto h-4 w-12 animate-pulse rounded-md bg-zinc-800" />
		</div>
	);
};
