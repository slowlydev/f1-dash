import Image from "next/image";
import Link from "next/link";

import ScrollHint from "@/components/ScrollHint";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

import icon from "public/tag-logo.svg";

export default function Home() {
	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<section className="flex h-screen w-full flex-col items-center pt-20 sm:justify-center sm:pt-0">
				<Image src={icon} alt="f1-dash tag logo" width={200} />

				<h1 className="my-20 text-center text-5xl font-bold">
					Real-time Formula 1 <br />
					telemetry and timing
				</h1>

				<div className="flex flex-wrap gap-4">
					<Link href="/dashboard">
						<Button className="!rounded-xl border-2 border-transparent p-4 font-medium">Go to Dashboard</Button>
					</Link>

					<Link href="/schedule">
						<Button className="!rounded-xl border-2 border-zinc-700 !bg-transparent p-4 font-medium">
							Check Schedule
						</Button>
					</Link>
				</div>

				<ScrollHint />
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">Whats f1-dash?</h2>

				<p className="text-md">
					f1-dash is a hobby project of mine that I started in 2023. It is a real-time telemetry and timing dashboard
					for Formula 1. It allows you to see the live telemetry data of the cars on the track and also the live timing.
					Which includes things like lap times, sector times, the gaps between the drivers, their tire choices and much
					more.
				</p>
			</section>

			<section className="pb-20">
				<h2 className="mb-4 text-2xl">Whats next?</h2>

				<p className="text-md">
					I am currently working on v3 of the dashboard. Which will allow more customization and have an updated design.
					I will also try to improve mobile UI and ship new cool features. If you have any suggestions or feedback, feel
					free to reach out on GitHub or the Discord.
				</p>
			</section>

			<Footer />
		</div>
	);
}
