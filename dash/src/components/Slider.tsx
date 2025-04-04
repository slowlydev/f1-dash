"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { ChangeEvent } from "react";

type Props = {
	value: number;
	setValue: (value: number) => void;
};

export default function Slider({ value, setValue }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(Number(event.target.value));
	}
	return (
		<input
			type="range"
			value={value}
			className={`h-2 w-full cursor-pointer appearance-none rounded-lg accent-indigo-500 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
			onChange={handleChange}
		></input>
	);
}
