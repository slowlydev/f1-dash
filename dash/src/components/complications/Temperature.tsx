"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import Gauge from "./Gauge";

type Props = {
	value: number;
	label: "TRC" | "AIR";
};

export default function TemperatureComplication({ value, label }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div
			className={`flex h-[55px] w-[55px] items-center justify-center rounded-full ${darkMode ? "bg-black" : "bg-white"}`}
		>
			<Gauge value={value} max={label === "TRC" ? 60 : 40} gradient="temperature" />

			<div className="mt-2 flex flex-col items-center gap-0.5">
				<p
					className={`flex h-[22px] shrink-0 text-xl font-medium not-italic leading-[normal] ${darkMode ? "text-[color:var(--Base-Text,#F2F2F2)]" : "text-[color:var(--Base-Text,#0D0D0D)]"}`}
				>
					{value}
				</p>
				<p className="flex h-[11px] shrink-0 text-center text-[10px] font-medium not-italic leading-[normal] text-[color:var(--Multicolor-Green,#67E151)]">
					{label}
				</p>
			</div>
		</div>
	);
}
