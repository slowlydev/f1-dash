"use client";

import { getWindDirection } from "@/lib/getWindDirection";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	speed: number;
	directionDeg: number;
};

export default function WindSpeedComplication({ speed, directionDeg }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div
			className={`flex h-[55px] w-[55px] items-center justify-center rounded-full ${darkMode ? "bg-black" : "bg-white"}`}
		>
			<div className="flex flex-col items-center">
				<p className="text-center text-[10px] font-medium leading-none text-blue-400">
					{getWindDirection(directionDeg)}
				</p>

				<p className={`text-xl font-medium leading-none ${darkMode} ? "text-white" : "text-black"`}>{speed}</p>

				<p className={`text-center text-[10px] font-medium leading-none ${darkMode ? "text-white" : "text-black"}`}>
					m/s
				</p>
			</div>
		</div>
	);
}
