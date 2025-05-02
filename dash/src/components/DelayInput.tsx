"use client";

import clsx from "clsx";

import { useState, useRef, useEffect } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	className?: string;
	saveDelay?: number;
};

export default function DelayInput({ className, saveDelay }: Props) {
	const currentDelay = useSettingsStore((s) => s.delay);
	const setDelay = useSettingsStore((s) => s.setDelay);
	const hasHydrated = useSettingsStore((s) => s.hasHydrated);

	const [delayState, setDelayState] = useState<string>(currentDelay.toString());

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const updateDelay = (updateInput: boolean = false) => {
		const delay = delayState ? Math.max(parseInt(delayState), 0) : 0;
		setDelay(delay);
		if (updateInput) setDelayState(delay.toString());
	};

	useEffect(() => {
		if (!hasHydrated) return;
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(updateDelay, saveDelay || 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [delayState]);

	useEffect(() => {
		if (hasHydrated) setDelayState(currentDelay.toString());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasHydrated]);

	const handleChange = (v: string) => {
		setDelayState(v);
	};

	return (
		<input
			className={clsx(
				"w-12 [appearance:textfield] rounded-lg bg-zinc-800 p-1 text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
				className,
			)}
			type="number"
			inputMode="numeric"
			min={0}
			placeholder="0s"
			value={delayState}
			onChange={(e) => handleChange(e.target.value)}
			onKeyDown={(e) => e.code == "Enter" && updateDelay(true)}
			onBlur={() => updateDelay(true)}
		/>
	);
}
