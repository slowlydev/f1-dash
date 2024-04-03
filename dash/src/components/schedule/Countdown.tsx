"use client";

import { AnimatePresence, motion } from "framer-motion";
import { duration, now, utc } from "moment";

import { Session } from "@/types/schedule.type";
import { useEffect, useRef, useState } from "react";

type Props = {
	next: Session;
	type: "race" | "other";
};

export default function Countdown({ next, type }: Props) {
	const [[days, hours, minutes, seconds], setDuration] = useState<
		[number | null, number | null, number | null, number | null]
	>([null, null, null, null]);

	const requestRef = useRef<number | null>(null);

	const animateNextFrame = () => {
		const nextMoment = utc(next.start);
		const diff = duration(nextMoment.diff(now()));

		if (diff.asSeconds() > 0) {
			setDuration([diff.days(), diff.hours(), diff.minutes(), diff.seconds()]);
		} else {
			setDuration([0, 0, 0, 0]);
		}
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	});

	return (
		<div>
			<p className="text-xl">Countdown until next {type === "race" ? "race" : "session"}</p>

			<AnimatePresence>
				<div className="grid auto-cols-max grid-flow-col gap-4 text-3xl">
					<div>
						<motion.p
							key={days}
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0 }}
						>
							{days}
						</motion.p>

						<p className="text-base text-zinc-600">days</p>
					</div>

					<div>
						<motion.p
							key={hours}
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0 }}
						>
							{hours}
						</motion.p>

						<p className="text-base text-zinc-600">hours</p>
					</div>

					<div>
						<motion.p
							key={minutes}
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0 }}
						>
							{minutes}
						</motion.p>
						<p className="text-base text-zinc-600">minutes</p>
					</div>

					<div>
						<motion.p
							key={seconds}
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0 }}
						>
							{seconds}
						</motion.p>
						<p className="text-base text-zinc-600">seconds</p>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}
