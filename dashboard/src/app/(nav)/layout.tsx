import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import githubIcon from "public/icons/github.svg";
import coffeeIcon from "public/icons/bmc-logo.svg";

import Footer from "@/components/Footer";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			<nav className="sticky top-0 left-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 p-2 px-4 backdrop-blur-lg">
				<div className="flex gap-4">
					<Link className="transition duration-100 active:scale-95" href="/">
						Home
					</Link>
					<Link className="transition duration-100 active:scale-95" href="/dashboard">
						Dashboard
					</Link>
					<Link className="transition duration-100 active:scale-95" href="/schedule">
						Schedule
					</Link>
					<Link className="transition duration-100 active:scale-95" href="/help">
						Help
					</Link>
				</div>

				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<Link
						className="flex items-center gap-2 transition duration-100 active:scale-95"
						href="https://www.buymeacoffee.com/slowlydev"
						target="_blank"
					>
						<Image src={coffeeIcon} alt="Buy Me A Coffee" width={20} height={20} />
						<span>Coffee</span>
					</Link>

					<Link
						className="flex items-center gap-2 transition duration-100 active:scale-95"
						href="https://github.com/slowlydev/f1-dash"
						target="_blank"
					>
						<Image src={githubIcon} alt="GitHub" width={20} height={20} />
						<span>GitHub</span>
					</Link>
				</div>
			</nav>

			<main className="container mx-auto max-w-(--breakpoint-lg) px-4">
				{children}

				<Footer />
			</main>
		</>
	);
}
