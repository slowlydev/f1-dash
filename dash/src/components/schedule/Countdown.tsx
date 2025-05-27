"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { duration, now, utc } from "moment";

import type { Session } from "@/types/schedule.type";

type Props = {
	next: Session;
	type: "race" | "other";
};

export default function Countdown({ next, type }: Props) {
	const [[days, hours, minutes, seconds], setDuration] = useState<
		[number | null, number | null, number | null, number | null]
	>([null, null, null, null]);

	const nextMoment = utc(next.start);

	const requestRef = useRef<number | null>(null);

	useEffect(() => {
		const animateNextFrame = () => {
			const diff = duration(nextMoment.diff(now()));

			const days = parseInt(diff.asDays().toString());

			if (diff.asSeconds() > 0) {
				setDuration([days, diff.hours(), diff.minutes(), diff.seconds()]);
			} else {
				setDuration([0, 0, 0, 0]);
			}

			requestRef.current = requestAnimationFrame(animateNextFrame);
		};

		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	}, [nextMoment]);

	return (
		<div>
			<p className="text-lg">Next {type === "race" ? "race" : "session"} in</p>

			<AnimatePresence>
				<div className="grid auto-cols-max grid-flow-col gap-4 text-3xl">
					<div>
						{days != undefined && days != null ? (
							<motion.p
								className="min-w-12"
								key={days}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{days}
							</motion.p>
						) : (
							<div className="h-9 w-12 animate-pulse rounded-md bg-zinc-800" />
						)}

						<p className="text-base text-zinc-500">days</p>
					</div>

					<div>
						{hours != undefined && hours != null ? (
							<motion.p
								className="min-w-12"
								key={hours}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{hours}
							</motion.p>
						) : (
							<div className="h-9 w-12 animate-pulse rounded-md bg-zinc-800" />
						)}

						<p className="text-base text-zinc-500">hours</p>
					</div>

					<div>
						{minutes != undefined && minutes != null ? (
							<motion.p
								className="min-w-12"
								key={minutes}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{minutes}
							</motion.p>
						) : (
							<div className="h-9 w-12 animate-pulse rounded-md bg-zinc-800" />
						)}

						<p className="text-base text-zinc-500">minutes</p>
					</div>

					<div>
						{seconds != undefined && seconds != null ? (
							<motion.p
								className="min-w-12"
								key={seconds}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{seconds}
							</motion.p>
						) : (
							<div className="h-9 w-12 animate-pulse rounded-md bg-zinc-800" />
						)}

						<p className="text-base text-zinc-500">seconds</p>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}
