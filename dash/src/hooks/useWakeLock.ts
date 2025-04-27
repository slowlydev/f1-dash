import { useEffect, useRef } from "react";

export const useWakeLock = () => {
	const wakeLock = useRef<null | WakeLockSentinel>(null);

	useEffect(() => {
		if (typeof window != undefined) {
			if (!window.isSecureContext) return;

			if (window.location.hostname === "localhost") return;

			if (!("wakeLock" in navigator)) return;

			navigator.wakeLock.request("screen").then((wl) => {
				wakeLock.current = wl;
			});
		}

		return () => {
			if (wakeLock.current) {
				wakeLock.current.release();
			}
		};
	}, []);
};
