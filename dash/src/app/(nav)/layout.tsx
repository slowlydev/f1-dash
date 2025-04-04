"use client";
import { type ReactNode } from "react";

import Menubar from "@/components/Menubar";
import IconLabelButton from "@/components/IconLabelButton";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div
			className={`min-h-screen w-full ${darkMode ? "bg-background-dark text-white" : "bg-background-light text-black"}`}
		>
			<div
				className={`sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b p-2 ${darkMode ? "border-primary-dark bg-black text-white" : "border-secondary-light bg-white text-black"}`}
			>
				<Menubar />
				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<IconLabelButton icon="bmc" href="https://www.buymeacoffee.com/slowlydev">
						Coffee
					</IconLabelButton>

					<IconLabelButton icon="github" href="https://github.com/slowlydev/f1-dash">
						GitHub
					</IconLabelButton>
				</div>
			</div>

			{children}
		</div>
	);
}
