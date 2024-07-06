import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";
import Footer from "@/components/Footer";

import FeatureCard from "@/components/landing/FeatureCard";
import ScrollHint from "@/components/landing/ScrollHint";

import { features } from "@/lib/data/features";

import icon from "public/tag-logo.svg";

const roadmap = [
	"Favorite Driver Highlighting & Filtering",
	"Driver Analytics for Pit Stop",
	"Driver Head-to-Head Comparison",
	"Full Race Playback",
	"Notifications for Race Control Messages",
	"Tire Lap Times Comparison",
];

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

			<section className="mb-10 flex w-full flex-col gap-2">
				<h2 className="mb-4 text-2xl">What are our Features?</h2>

				<div className="grid grid-flow-row grid-cols-1 gap-2 sm:grid-cols-2">
					{features.map((feature, i) => (
						<FeatureCard key={`feature.${i}`} {...feature} />
					))}
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl">Whats on our roadmap?</h2>

				<p className="text-md">
					{roadmap.join(" · ")} {" · "} <span className="text-zinc-600">Your suggestion?</span>
				</p>
			</section>

			<Footer />
		</div>
	);
}
