"use client";

import { clsx } from "clsx";
import { useEffect, useState, type FormEvent } from "react";

type Props = {
	id?: string;
	className?: string;
	delay: number;
	setDebouncedDelay: (delay: number) => void;
};

export default function DelayInput({ id, className, delay, setDebouncedDelay }: Props) {
	const [delayI, setDelayI] = useState<string>("");

	const updateDebounced = () => {
		const nextDelay = delayI ? parseInt(delayI) : 0;
		if (nextDelay < 0) return;
		setDebouncedDelay(nextDelay);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateDebounced();
	};

	useEffect(() => {
		setDelayI(delay.toString());
	}, [delay]);

	return (
		<form id={id} className={clsx("flex rounded-lg bg-zinc-800 p-2", className)} onSubmit={handleSubmit}>
			<input
				value={delayI}
				onChange={(e) => setDelayI(e.target.value)}
				onBlur={() => updateDebounced()}
				placeholder="0s"
				className="w-16 bg-zinc-800 text-center leading-none text-white placeholder-white"
			/>
		</form>
	);
}
