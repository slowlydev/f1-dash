"use client";

import { useState, type FormEvent } from "react";
import { clsx } from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	className?: string;
};

export default function DelayInput({ className }: Props) {
	const settings = useSettingsStore();

	const [delay, setDelay] = useState<string>(settings.delay.toString());

	const updateDebounced = () => {
		const nextDelay = delay ? parseInt(delay) : 0;
		if (nextDelay < 0) return;
		settings.setDelay(nextDelay);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateDebounced();
	};

	return (
		<form className={clsx("flex rounded-lg bg-zinc-800 p-2", className)} onSubmit={handleSubmit}>
			<input
				value={settings.delay}
				onChange={(e) => setDelay(e.target.value)}
				onBlur={() => updateDebounced()}
				placeholder="0s"
				className="w-16 bg-zinc-800 text-center leading-none text-white placeholder-white"
			/>
		</form>
	);
}
