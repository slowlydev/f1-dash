"use client";

import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	className?: string;
};

export default function DelayInput({ className }: Props) {
	const currentDelay = useSettingsStore((s) => s.delay);
	const setDelay = useSettingsStore((s) => s.setDelay);
	const darkMode = useSettingsStore((state) => state.darkMode);

	const handleChange = (v: string) => {
		const delay = v ? parseInt(v) : 0;
		if (delay < 0) return;
		setDelay(delay);
	};

	return (
		<input
			className={clsx(
				`w-12 rounded-lg p-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`,
				darkMode ? "bg-primary-dark" : "bg-primary-light",
				className,
			)}
			type="number"
			min={0}
			placeholder="0s"
			value={currentDelay}
			onChange={(e) => handleChange(e.target.value)}
		/>
	);
}
