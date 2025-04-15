"use client";

import { useState, useRef } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import clsx from "clsx";

export default function DelayTimer() {
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const setDelay = useSettingsStore((s) => s.setDelay);

    const handleClick = () => {
        if (!isRunning) {
            // Start timer
            startTimeRef.current = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setDelay(elapsed);
            }, 100);
            setIsRunning(true);
        } else {
            // Stop timer
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsRunning(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                "flex items-center justify-center rounded-lg px-3 py-1 text-sm transition-colors",
                isRunning 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-zinc-800 hover:bg-zinc-700"
            )}
        >
            {isRunning ? "Stop" : "Start"}
        </button>
    );
} 