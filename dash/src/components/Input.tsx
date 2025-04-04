"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import clsx from "clsx";

type Props = {
	value: string;
	setValue: (value: string) => void;
};

export default function Input({ value, setValue }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);

	return (
		<input
			className={clsx(
				`w-12 rounded-lg p-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`,
			)}
			type="text"
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
