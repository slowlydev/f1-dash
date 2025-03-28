"use client";

import Image from "next/image";

import rainIcon from "public/icons/cloud.heavyrain.svg";
import noRainIcon from "public/icons/cloud.rain.svg";

import rainIconLight from "public/icons/cloud.heavyrain-light.svg";
import noRainIconLight from "public/icons/cloud.rain-light.svg";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	rain: boolean;
};

export default function RainComplication({ rain }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div
			className={`flex h-[55px] w-[55px] items-center justify-center rounded-full ${darkMode ? "bg-black" : "bg-white"}`}
		>
			{rain ? (
				<Image src={darkMode ? rainIcon : rainIconLight} alt="rain" className="h-[25px] w-auto" />
			) : (
				<Image src={darkMode ? noRainIcon : noRainIconLight} alt="no rain" className="h-[25px] w-auto" />
			)}
		</div>
	);
}
