"use client";

import Gauge from "./Gauge";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { convertTemperature } from "@/lib/temperature";

type Props = {
	/** temperature in degrees Celsius, as sent by the data feed */
	value: number;
	label: "TRC" | "AIR";
};

export default function TemperatureComplication({ value, label }: Props) {
	const temperatureUnit = useSettingsStore((state) => state.temperatureUnit);
	const shown = convertTemperature(value, temperatureUnit);

	return (
		<div className="relative flex h-[55px] w-[55px] items-center justify-center rounded-full bg-black">
			<Gauge value={value} max={label === "TRC" ? 60 : 40} gradient="temperature" />

			<div className="mt-2 flex flex-col items-center gap-0.5">
				<p className="flex h-[22px] shrink-0 text-xl leading-[normal] font-medium text-[color:var(--Base-Text,#F2F2F2)] not-italic">
					{shown}
				</p>
				<p className="flex h-[11px] shrink-0 text-center text-[10px] leading-[normal] font-medium text-[color:var(--Multicolor-Green,#67E151)] not-italic">
					{label}
				</p>
			</div>
		</div>
	);
}
