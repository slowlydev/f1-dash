"use client";

import { FormEvent, useState } from "react";

type Props = {
	setDebouncedDelay: (delay: number) => void;
};

export default function DelayInput({ setDebouncedDelay }: Props) {
	const [delay, setDelay] = useState("");

	const updateDebounced = () => {
		const nextDelay = delay ? parseInt(delay) : 0;
		if (nextDelay < 0) return;
		setDebouncedDelay(nextDelay);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		updateDebounced();
	};

	return (
		<form className="flex rounded-lg bg-zinc-800 p-2" onSubmit={handleSubmit}>
			<input
				value={delay}
				onChange={(e) => setDelay(e.target.value)}
				onBlur={() => updateDebounced()}
				placeholder="0s"
				className="w-16 bg-zinc-800 text-center leading-none text-white placeholder-white"
			/>
		</form>
	);
}
