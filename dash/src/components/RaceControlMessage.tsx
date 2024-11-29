import { motion } from "framer-motion";
import { utc } from "moment";
import Image from "next/image";
import clsx from "clsx";

import type { Message } from "@/types/state.type";

import { useSettingsStore } from "@/stores/useSettingsStore";

import { toTrackTime } from "@/lib/toTrackTime";

import { useEffect, useRef } from "react";

type Props = {
	msg: Message;
	gmtOffset: string;
};

const getDriverNumber = (msg: Message) => {
	const groups = msg.message.match(/\d+/);

	if (!groups) {
		return null;
	}

	return groups[0];
};

const loadTime = new Date();
const chime = new Audio("/sounds/chime.mp3");
let loadTimeUTC = loadTime.toISOString();

export function RaceControlMessage({ msg, gmtOffset }: Props) {
	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(getDriverNumber(msg) ?? ""));
	const raceControlChime = useSettingsStore((state) => state.raceControlChime);
	const lastMessageIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (loadTimeUTC < msg.utc) {
				if (msg.id !== lastMessageIdRef.current) {
					lastMessageIdRef.current = msg.id;
					if (raceControlChime == true) {
						chime.play();
					}
				}
			}
		}
	}, [msg]);
	return (
		<motion.li
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: -20 }}
			className={clsx("flex flex-col gap-1 p-2", { "bg-sky-800 bg-opacity-30": favoriteDriver })}
		>
			<div className="flex items-center gap-1 text-sm font-medium leading-none text-gray-500">
				{msg.lap && (
					<>
						<p>LAP {msg.lap}</p>
						{"·"}
					</>
				)}
				<time dateTime={utc(msg.utc).local().format("HH:mm:ss")}>{utc(msg.utc).local().format("HH:mm:ss")}</time>
				{"·"}
				<time className="text-gray-600" dateTime={utc(msg.utc).format("HH:mm")}>
					{utc(toTrackTime(msg.utc, gmtOffset)).format("HH:mm")}
				</time>
			</div>

			<div className="flex gap-1">
				{msg.flag && msg.flag !== "CLEAR" && (
					<div>
						<Image
							src={`/flags/${msg.flag.toLowerCase().replaceAll(" ", "-")}-flag.svg`}
							alt={msg.flag}
							width={20}
							height={20}
						/>
					</div>
				)}

				<p className="text-sm">{msg.message}</p>
			</div>
		</motion.li>
	);
}
