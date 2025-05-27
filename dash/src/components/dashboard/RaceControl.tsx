import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";

import { sortUtc } from "@/lib/sorting";

import { RaceControlMessage } from "@/components/dashboard/RaceControlMessage";

export default function RaceControl() {
	const messages = useDataStore((state) => state.raceControlMessages?.messages);
	const gmtOffset = useDataStore((state) => state.sessionInfo?.gmtOffset);

	const raceControlChime = useSettingsStore((state) => state.raceControlChime);
	const raceControlChimeVolume = useSettingsStore((state) => state.raceControlChimeVolume);

	const chimeRef = useRef<HTMLAudioElement | null>(null);
	const pastMessageTimestamps = useRef<string[] | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const chime = new Audio("/sounds/chime.mp3");
			chime.volume = raceControlChimeVolume / 100;
			chimeRef.current = chime;

			return () => {
				chimeRef.current = null;
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (messages === undefined) return;

		if (!pastMessageTimestamps.current) {
			pastMessageTimestamps.current = messages.map((msg) => msg.utc);
			return;
		}

		const newMessages = messages.filter((msg) => !pastMessageTimestamps.current?.includes(msg.utc));

		if (newMessages.length > 0 && raceControlChime) {
			chimeRef.current?.play();
		}

		pastMessageTimestamps.current = messages.map((msg) => msg.utc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<ul className="flex flex-col gap-2">
			{!messages &&
				new Array(7).fill("").map((_, index) => <SkeletonMessage key={`msg.loading.${index}`} index={index} />)}

			{messages && gmtOffset && (
				<AnimatePresence>
					{messages
						.sort(sortUtc)
						.filter((msg) => (msg.flag ? msg.flag.toLowerCase() !== "blue" : true))
						.map((msg, i) => (
							<RaceControlMessage key={`msg.${i}`} msg={msg} gmtOffset={gmtOffset} />
						))}
				</AnimatePresence>
			)}
		</ul>
	);
}

const SkeletonMessage = ({ index }: { index: number }) => {
	const animateClass = "h-6 animate-pulse rounded-md bg-zinc-800";

	const flag = index % 4 === 0;
	const long = index % 5 === 0;
	const mid = index % 3 === 0;

	return (
		<li className="flex flex-col gap-1 p-2">
			<div className={clsx(animateClass, "h-4! w-16")} />

			<div className="flex gap-1">
				{flag && <div className={clsx(animateClass, "w-6")} />}
				<div className={animateClass} style={{ width: long ? "100%" : mid ? "75%" : "40%" }} />
			</div>
		</li>
	);
};
