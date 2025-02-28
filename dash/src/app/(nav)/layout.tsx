import { type ReactNode } from "react";

import IconLabelButton from "@/components/IconLabelButton";
import NavButton from "@/components/NavButton";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			<nav className="sticky top-0 left-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 bg-black p-2 px-4">
				<div className="flex gap-4">
					<NavButton href="/">Home</NavButton>
					<NavButton href="/dashboard">Dashboard</NavButton>
					<NavButton href="/schedule">Schedule</NavButton>
					<NavButton href="/settings">Settings</NavButton>
					<NavButton href="/help">Help</NavButton>
				</div>

				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<IconLabelButton icon="bmc" href="https://www.buymeacoffee.com/slowlydev">
						Coffee
					</IconLabelButton>

					<IconLabelButton icon="github" href="https://github.com/slowlydev/f1-dash">
						GitHub
					</IconLabelButton>
				</div>
			</nav>

			{children}
		</>
	);
}
