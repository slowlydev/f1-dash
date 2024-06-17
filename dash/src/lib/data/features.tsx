import Image from "next/image";

import DriverMiniSectors from "@/components/driver/DriverMiniSectors";
import DriverQuali from "@/components/QualifyingDriver";
import DriverLapTime from "@/components/driver/DriverLapTime";
import DriverInfo from "@/components/driver/DriverInfo";
import DriverTire from "@/components/driver/DriverTire";
import DriverDRS from "@/components/driver/DriverDRS";
import DriverGap from "@/components/driver/DriverGap";

import softTireIcon from "public/tires/soft.svg";
import mediumTireIcon from "public/tires/medium.svg";
import hardTireIcon from "public/tires/hard.svg";
import intermediateTireIcon from "public/tires/intermediate.svg";
import wetTireIcon from "public/tires/wet.svg";

import { appTimingDriver, driver, timingDriver, timingStatsDriver } from "./exampleDriverData";

export const features = [
	{
		title: "Sector Times & Mini Sectors",
		description:
			"Get all the sector times with colored mini sectors, too see where exactly a driver has improved his lap time.",
		children: (
			<DriverMiniSectors
				sectors={timingDriver.sectors}
				bestSectors={timingStatsDriver.bestSectors}
				tla={driver.tla}
				showFastest={false}
			/>
		),
	},
	{
		title: "Driver Status",
		description: "See the status of DRS and PIT of every driver at a glance and check on what lap he is on.",
		children: (
			<div className="flex gap-2">
				<div className="w-[4rem]">
					<DriverDRS on={true} possible={false} inPit={false} pitOut={false} />
				</div>
				<div className="w-[4rem]">
					<DriverDRS on={false} possible={false} inPit={true} pitOut={false} />
				</div>
				<DriverInfo gridPos={2} timingDriver={timingDriver} />
			</div>
		),
	},
	{
		title: "Tires & Pit Stops",
		description:
			"Monitor tire usage and pit stop strategies throughout the race. Keep track of when drivers make their crucial pit stops, switch tire compounds, and manage their tire wear to optimize race performance.",
		children: (
			<div className="flex gap-2">
				<div className="flex space-x-[-1rem] ">
					<Image src={softTireIcon} alt="soft" className="h-8 w-8" />
					<Image src={mediumTireIcon} alt="medium" className="h-8 w-8" />
					<Image src={hardTireIcon} alt="hard" className="h-8 w-8" />
					<Image src={intermediateTireIcon} alt="intermediates" className="h-8 w-8" />
					<Image src={wetTireIcon} alt="wets" className="h-8 w-8" />
				</div>

				{/* TODO add example data  */}
				<DriverTire stints={[{ totalLaps: 10, compound: "SOFT", new: "true" }]} />
			</div>
		),
	},
	{
		title: "Gap & Lap Times",
		description: "Compare current and best lap times and analyze gaps between drivers.",
		children: (
			<div className="flex gap-4">
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={true} />
				<DriverGap timingDriver={timingDriver} sessionPart={0} />
			</div>
		),
	},
	{
		title: "Qualifying Mode",
		description:
			"Switch to qualifying mode for in-depth analysis of qualifying sessions. Access detailed insights into each driver's performance during qualifying laps, including sector times, lap history, and starting positions for the race.",
		children: <></>,
	},
	{
		title: "Violation Tracker",
		description:
			"Stay on top of race regulations with the violation tracker. Get a overview about any rule infringements or penalties issued during the session.",
		children: <></>,
	},
	{
		title: "Multi window setups",
		description:
			"Customize your viewing experience with multi-window setups. Arrange and display multiple data streams simultaneously, allowing you to focus on the metrics that matter most to you without missing any of the action on the track.",
		children: <></>,
	},
	{
		title: "Favorite Drivers Filters",
		description:
			"Personalize your dashboard by filtering information based on your favorite drivers. Follow specific drivers closely throughout the race, receiving updates tailored to their progress and performance on the track.",
		children: <></>,
	},
	{
		title: "Customizable UI",
		description:
			"Tailor the dashboard to suit your preferences with a customizable user interface. Adjust layouts, data displays, and visual elements to create a personalized viewing experience that enhances your enjoyment of Formula 1 racing.",
		children: <></>,
	},
	{
		title: "Modern Design",
		description:
			"The design ensures that all information is readily accessible at a glance, enhancing your Formula 1 viewing experience.",
		children: (
			<div className="flex h-8 items-center gap-8">
				<p>Made with Tailwind</p>
				<p>Inspired by Vercel</p>
				<p>Inspired by Apple</p>
			</div>
		),
	},
];
