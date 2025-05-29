import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import ScrollHint from "@/components/ScrollHint";

import icon from "public/tag-logo.svg";

export default function Home() {
	return (
		<div>
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
					The new design of v3 enables for more pages and features. So in the future where will be incremental updates
					and new features comming. If you have any suggestions or feedback, feel free to reach out on GitHub or the
					Discord.
				</p>
			</section>
		</div>
	);
}
