import { type ReactNode } from "react";
import Image from "next/image";

import githubIcon from "public/icons/github.svg";
import coffeeIcon from "public/icons/bmc-logo.svg";

import MotionLink from "@/components/ui/MotionLink";
import Footer from "@/components/Footer";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			<nav className="sticky top-0 left-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 p-2 px-4 backdrop-blur-lg">
				<div className="flex gap-4">
					<MotionLink href="/">Home</MotionLink>
					<MotionLink href="/dashboard">Dashboard</MotionLink>
					<MotionLink href="/schedule">Schedule</MotionLink>
					<MotionLink href="/settings">Settings</MotionLink>
					<MotionLink href="/help">Help</MotionLink>
				</div>

				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<MotionLink href="https://www.buymeacoffee.com/slowlydev" target="_blank" className="flex items-center gap-2">
						<Image src={coffeeIcon} alt="Buy Me A Coffee" width={20} height={20} />
						<span>Coffee</span>
					</MotionLink>

					<MotionLink href="https://github.com/slowlydev/f1-dash" target="_blank" className="flex items-center gap-2">
						<Image src={githubIcon} alt="GitHub" width={20} height={20} />
						<span>GitHub</span>
					</MotionLink>
				</div>
			</nav>

			<main className="container mx-auto max-w-(--breakpoint-lg) px-4">
				{children}

				<Footer />
			</main>
		</>
	);
}
