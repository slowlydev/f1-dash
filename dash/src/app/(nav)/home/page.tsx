import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";

import icon from "../../../../public/tag-logo.svg";

import FeatureCard from "@/components/landing/FeatureCard";
import ScrollHint from "@/components/landing/ScollHint";

import { features } from "@/lib/data/features";

const roadmap = [
	"Favorite Driver Highlighting & Filtering",
	"Driver Analytics for Pit Stop",
	"Driver Head-to-Head Comparison",
	"Go back to start of current race",
	"Notifications for Race Control Messages of selected drivers",
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

				<Link href="/">
					<Button className="!rounded-xl p-4 font-medium">Go to Dashboard</Button>
				</Link>

				<ScrollHint />
			</section>

			<section className="mb-10 flex w-full flex-col gap-2">
				<h2 className="mb-4 text-2xl">What are our Features?</h2>
				<div className="grid grid-flow-row  grid-cols-1 gap-2 sm:grid-cols-2">
					{features.map((feature, i) => (
						<FeatureCard key={`feature.${i}`} {...feature} />
					))}
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl">Whats on our roadmap?</h2>

				<p className="text-xl font-medium">
					{roadmap.join(" · ")} {" · "} <span className="text-xl font-medium text-zinc-500">Your suggestion?</span>
				</p>
			</section>

			<footer className="my-10 w-full text-zinc-500">
				<div className="mb-4 flex flex-wrap gap-x-8 gap-y-2">
					<p>Developed with ❤️ by Slowly</p>
					<p>Contribute on GitHub</p>
					<p>Checkout the Community Discord</p>
					<p>Get help</p>
					<p>Buy me a coffee to support me</p>
				</div>

				<p className="text-sm">
					This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA
					ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula
					One Licensing B.V
				</p>
			</footer>
		</div>
	);
}
