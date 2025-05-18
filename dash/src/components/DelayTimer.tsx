"use client";

import { useRef } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

import PlayControls from "@/components/ui/PlayControls";

export default function DelayTimer() {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(0);

	const setDelay = useSettingsStore((s) => s.setDelay);
	const currentDelay = useSettingsStore((s) => s.delay);
	const setDelayIsPaused = useSettingsStore((s) => s.setDelayIsPaused);
	const delayIsPaused = useSettingsStore((s) => s.delayIsPaused);

	const handleClick = () => {
		if (!delayIsPaused) {
			// Start timer from current delay
			startTimeRef.current = Date.now() - currentDelay * 1000;
			intervalRef.current = setInterval(() => {
				const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
				setDelay(elapsed);
			}, 100);
			setDelayIsPaused(true);
		} else {
			// Stop timer but keep current delay
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			setDelayIsPaused(false);
		}
	};

	return <PlayControls playing={!delayIsPaused} onClick={handleClick} />;
}
