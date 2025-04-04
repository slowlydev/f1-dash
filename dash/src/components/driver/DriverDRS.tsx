"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import clsx from "clsx";

type Props = {
	on: boolean;
	possible: boolean;
	inPit: boolean;
	pitOut: boolean;
};

export default function DriverDRS({ on, possible, inPit, pitOut }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	const pit = inPit || pitOut;

	return (
		<span
			id="walkthrough-driver-drs"
			className={clsx(
				"text-md inline-flex h-8 w-full items-center justify-center rounded-md border-2 font-mono font-black",
				{
					[darkMode ? "border-secondary-dark text-secondary-dark" : "border-secondary-light text-secondary-light"]:
						!pit && !on && !possible,
					"border-zinc-400 text-zinc-400": !pit && !on && possible,
					"border-emerald-500 text-emerald-500": !pit && on,
					"border-cyan-500 text-cyan-500": pit,
				},
			)}
		>
			{pit ? "PIT" : "DRS"}
		</span>
	);
}
