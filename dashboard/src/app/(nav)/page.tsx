import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import ScrollHint from "@/components/ScrollHint";

import icon from "public/tag-logo.svg";

export default function Home() {
	return (
		<div>
			{/*<div className="absolute left-1/2 mx-auto my-4 -translate-x-1/2 rounded-xl border-2 border-red-600 bg-red-950 p-2 text-red-700 shadow-sm">
				<p className="text-sm text-red-600">Due to changes of the F1 API, some data might not be available anymore.</p>
			</div>*/}

			<section className="flex h-screen w-full flex-col items-center pt-20 sm:justify-center sm:pt-0">
				<Image src={icon} alt="f1-dash tag logo" width={200} />

				<h1 className="my-20 text-center text-5xl font-bold">
					Real-time Formula 1 <br />
					telemetry and timing
				</h1>

				<div className="flex flex-wrap gap-4">
					<Link href="/dashboard">
						<Button className="rounded-xl! border-2 border-transparent p-4 font-medium">Go to Dashboard</Button>
					</Link>

					<Link href="/schedule">
						<Button className="rounded-xl! border-2 border-zinc-700 bg-transparent! p-4 font-medium">
							Check Schedule
						</Button>
					</Link>
				</div>

				<ScrollHint />
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">What&apos;s f1-dash?</h2>

				<p className="text-md">
					f1-dash is a hobby project of mine that I started in 2023. It is a real-time telemetry and timing dashboard
					for Formula 1. It allows you to see the live telemetry data of the cars on the track and also the live timing,
					which includes things like lap times, sector times, the gaps between the drivers, their tire choices and much
					more.
				</p>
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">What happend to the position data & car metrics?</h2>

				<p className="text-md">
					Formula 1 changed the accesablity of the positional and car data, as its now locked behind a subscription. As
					I am not willing to circumvent this as well as not implement a not so secure and proper way of an f1 login,
					this data is not available anymore.
				</p>

				<p className="text-md">
					For the positional data we now use minisectors to get an approximate position, from the nature of the
					minisectors this is not as accurate as the previous positional data, but it still gives a good indication of
					where the cars are on track.
				</p>
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">What is the state of f1-dash?</h2>

				<p className="text-md">
					Currently the project is kind of in a maintenance mode. The GitHub Repository is not 100% up-to-date anymore
					as I was beginning with a major refactor which is not public yet. This refactored version is currently running
					here on f1-dash.com. I am planning to release this version sometime, but currently I am focusing on other
					projects.
				</p>
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">What&apos;s next?</h2>

				<p className="text-md">
					With v3 was the start of something big. The Initial rediesign enabled different ways to view the data. Sadly
					with the recent changes of formula 1, as well as the burdon of maintining and operating the platform under
					constant growth and lastly the fact that some people did not respect the OpenSource nature and liscense of the
					project. I decided to slowdown the development and focus on basic maintenance and the development of a new
					project called{" "}
					<a className="text-blue-500" target="_blank" href="https://nitrous.software">
						nitrous
					</a>
					. I will post some updates from time to time on Discord or the Website.
				</p>
			</section>
		</div>
	);
}
