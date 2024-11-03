import { useEffect, useRef, useState } from "react";

export const useWakeLock = () => {
	let wakeLock = useRef<null | WakeLockSentinel>(null);

	useEffect(() => {
		if (typeof window != undefined) {
			if ("wakeLock" in navigator) {
				navigator.wakeLock.request("screen").then((wl) => {
					wakeLock.current = wl;
				});
			}
		}

		return () => {
			if (wakeLock.current) {
				wakeLock.current.release();
			}
		};
	}, []);
};
