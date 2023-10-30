// "use client";

import Link from "next/link";
import Image from "next/image";

import { env } from "@/env.mjs";
import { exampleDriver } from "../help/example-driver";

import mapFeature from "public/map-feature-home.png";
import tagLogo from "public/tag-logo.png";
import arrow from "public/icons/arrow-up.svg";
import githubLogo from "public/icons/github.svg";

import softTireIcon from "public/tires/soft.svg";
import mediumTireIcon from "public/tires/medium.svg";
import hardTireIcon from "public/tires/hard.svg";
import intermediateTireIcon from "public/tires/intermediate.svg";
import wetTireIcon from "public/tires/wet.svg";

import DriverMiniSectors from "@/components/DriverMiniSectors";
import DriverTire from "@/components/DriverTire";
import DriverInfo from "@/components/DriverInfo";
import UpNextMeeting from "@/components/UpNext";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { NextMeeting } from "@/types/nextMeeting.type";

const getNextMeeting = async (): Promise<NextMeeting> => {
	const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/next-meeting`);
	const res: NextMeeting = await req.json();
	return res;
};

export default async function Page() {
	const nextMeeting = await getNextMeeting();

	const featureClass = "flex flex-col gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-4";

	return (
		<div className="container mx-auto px-4">
			<Navbar />

			<div className="flex h-[60vh] w-full flex-col items-center justify-center">
				<Image src={tagLogo} alt="f1-dash" className="w-[180px]" />
				<h1 className="text-center text-6xl font-bold text-white">Real-time Formula 1 telemetry and timing</h1>
				<div className="mt-10 flex flex-col items-center gap-10">
					<div className="flex items-center gap-2">
						<Image src={githubLogo} alt="github icon" className="h-8 w-8" />
						<p className="opacity-50">We're open-source</p>
					</div>

					<div>
						<Link href="/">
							<Button>Dashboard</Button>
						</Link>
					</div>
				</div>
			</div>

			<div className="mb-4">
				<p className="text-xl font-semibold text-gray-500">What's our</p>
				<h2 className="mb-4 text-3xl font-bold">Core Features</h2>

				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
					<div className={featureClass}>
						<p className="text-lg leading-none">Tires & Pitstops</p>
						<p className="leading-none text-gray-400">
							Discover which tires the drivers are using and how old they are. As well as their numbers of pitstops.
						</p>
						<div className="flex gap-2 rounded-lg bg-zinc-900 p-4">
							<div className="flex space-x-[-1rem] ">
								<Image src={softTireIcon} alt="soft" className="h-8 w-8" />
								<Image src={mediumTireIcon} alt="medium" className="h-8 w-8" />
								<Image src={hardTireIcon} alt="hard" className="h-8 w-8" />
								<Image src={intermediateTireIcon} alt="intermediates" className="h-8 w-8" />
								<Image src={wetTireIcon} alt="wets" className="h-8 w-8" />
							</div>

							<DriverTire stints={exampleDriver.stints} />
						</div>
					</div>

					<div className={featureClass}>
						<p className="text-lg font-medium leading-none">Sectores</p>
						<p className="leading-none text-gray-400">
							See Sectore Times and even Minisector data, to figure out whos on a potential personal best or even
							fastest lap.
						</p>
						<div className="rounded-lg bg-zinc-900 p-4">
							<DriverMiniSectors driverDisplayName="test" sectors={exampleDriver.sectors} />
						</div>
					</div>

					<div className={featureClass}>
						<p className="text-lg font-medium leading-none">Track Map</p>
						<p className="leading-none text-gray-400">
							See the postion of the drivers in realtime. Where and if drivers crashed and their status.
						</p>
						<div className="rounded-lg bg-zinc-900">
							<Image src={mapFeature} alt="" className="rounded-lg" />
						</div>
					</div>

					<div className={featureClass}>
						<p className="text-lg font-medium leading-none">TBD</p>
						<p className="leading-none text-gray-400">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dolores
						</p>
						<div className="rounded-lg bg-zinc-900 p-4">
							<DriverInfo laps={exampleDriver.laps} status={exampleDriver.status} />
						</div>
					</div>
				</div>
			</div>

			<UpNextMeeting nextMeeting={nextMeeting} />

			<div className="flex items-center gap-1">
				<Link href="/archive">Checkout the archive for more races</Link>
				<Image src={arrow} alt="arrow right" className="h-4 w-4 rotate-90" />
			</div>

			<div>
				<h2 className="mb-4 text-3xl font-bold"></h2>
			</div>

			<Footer />
		</div>
	);
}
