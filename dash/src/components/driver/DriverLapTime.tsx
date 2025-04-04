"use client";

import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	last: TimingDataDriver["lastLapTime"];
	best: TimingDataDriver["bestLapTime"];
	hasFastest: boolean;
};

export default function DriverLapTime({ last, best, hasFastest }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div className="place-self-start" id="walkthrough-driver-laptime">
			<p
				className={clsx(
					"text-lg font-semibold leading-none",
					getTimeColor(last.overallFastest, last.personalFastest),
					!last.value && (darkMode ? "text-tertiary-dark" : "text-tertiary-light"),
				)}
			>
				{!!last.value ? last.value : "-- -- ---"}
			</p>
			<p
				className={clsx(
					"text-sm font-medium leading-none",
					getTimeColor(hasFastest, true),
					!best.value && (darkMode ? "text-tertiary-dark" : "text-tertiary-light"),
				)}
			>
				{!!best.value ? best.value : "-- -- ---"}
			</p>
		</div>
	);
}
