"use client";

import { unix } from "moment";
import { motion, useMotionValue, useDragControls, AnimatePresence } from "motion/react";

import { useState, useRef, useEffect, type RefObject } from "react";

function getProgressFromX<T extends HTMLElement>({
	x,
	containerRef,
}: {
	x: number;
	containerRef: RefObject<T | null>;
}) {
	const bounds = containerRef.current?.getBoundingClientRect();

	if (!bounds) return 0;

	const progress = (x - bounds.x) / bounds.width;
	return clamp(progress, 0, 1);
}

function getXFromProgress<T extends HTMLElement>({
	progress,
	containerRef,
}: {
	progress: number;
	containerRef: RefObject<T | null>;
}) {
	const bounds = containerRef.current?.getBoundingClientRect();

	if (!bounds) return 0;

	return progress * bounds.width;
}

function clamp(number: number, min: number, max: number) {
	return Math.max(min, Math.min(number, max));
}

function useInterval(callback: () => void, delay: number | null) {
	const intervalRef = useRef<null | NodeJS.Timeout>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => savedCallback.current();

		if (typeof delay === "number") {
			intervalRef.current = setInterval(tick, delay);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [delay]);

	return intervalRef;
}

type Props = {
	frames: {
		id: number;
		time: number;
	}[];

	setFrame: (id: number) => void;

	playing: boolean;
};

export default function Timeline({ frames, setFrame, playing }: Props) {
	const constraintsRef = useRef<HTMLDivElement | null>(null);
	const fullBarRef = useRef<null | HTMLDivElement>(null);
	const scrubberRef = useRef<null | HTMLButtonElement>(null);

	const scrubberX = useMotionValue(0);
	const currentTimePrecise = useMotionValue(0);
	const dragControls = useDragControls();

	const [dragging, setDragging] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0); // relative to DURATION

	const startTime = frames[0].time;
	const endTime = frames[frames.length - 1].time;

	const DURATION = endTime - startTime;

	const currentTime = startTime + time;

	// let minsRemaining = Math.floor((DURATION - currentTime) / 60);
	// let secsRemaining = `${(DURATION - currentTime) % 60}`.padStart(2, "0");
	// let timecodeRemaining = `${minsRemaining}:${secsRemaining}`;
	// let progress = (currentTime / DURATION) * 100;

	useEffect(() => {
		const targetTime = startTime + time;

		// find the nearest frame, but it must be older
		const nearestFrame = frames.findLast((frame) => frame.time <= targetTime);

		if (nearestFrame) {
			setFrame(nearestFrame.id);
		}
	}, [time, frames, setFrame, startTime]);

	// every 0.5s, advance 10 minutes
	useInterval(
		() => {
			if (time < DURATION) {
				setTime((t) => t + 10 * 60);
			} else {
				setTime(0);
			}
		},
		playing ? 500 : null,
	);

	// every 0.01s, advance 0.2 minutes
	useInterval(
		() => {
			if (currentTimePrecise.get() < DURATION) {
				currentTimePrecise.set(currentTimePrecise.get() + 0.2 * 60); // 12

				const newX = getXFromProgress({
					containerRef: fullBarRef,
					progress: currentTimePrecise.get() / DURATION,
				});

				scrubberX.set(newX);
			} else {
				currentTimePrecise.set(0);
				scrubberX.set(0);
			}
		},
		playing ? 10 : null,
	);

	const legendCount = 10;
	const timeInterval = DURATION / (legendCount - 1);

	return (
		<div className="relative w-full select-none">
			<div
				className="relative mt-2"
				onPointerDown={(event) => {
					const newProgress = getProgressFromX({
						containerRef: fullBarRef,
						x: event.clientX,
					});
					dragControls.start(event, { snapToCursor: true });
					setTime(Math.floor(newProgress * DURATION));
					currentTimePrecise.set(newProgress * DURATION);
				}}
			>
				<div ref={fullBarRef} className="h-1 w-full rounded-full bg-zinc-800" />

				{/* <motion.div layout style={{ width: progressPreciseWidth }} className="absolute top-0">
					<div className="bg- absolute inset-0 h-[3px] rounded-full bg-slate-500"></div>
				</motion.div> */}

				<div className="absolute inset-0" ref={constraintsRef}>
					<motion.button
						className="absolute flex cursor-ew-resize items-center justify-center rounded-full active:cursor-grabbing"
						ref={scrubberRef}
						drag="x"
						dragConstraints={constraintsRef}
						dragControls={dragControls}
						dragElastic={0}
						dragMomentum={false}
						style={{ x: scrubberX }}
						onDrag={() => {
							if (!scrubberRef.current) return;
							const scrubberBounds = scrubberRef.current.getBoundingClientRect();
							const middleOfScrubber = scrubberBounds.x + scrubberBounds.width / 2;
							const newProgress = getProgressFromX({
								containerRef: fullBarRef,
								x: middleOfScrubber,
							});

							setTime(Math.floor(newProgress * DURATION));
							currentTimePrecise.set(newProgress * DURATION);
						}}
						onDragStart={() => setDragging(true)}
						onPointerDown={() => setDragging(true)}
						onPointerUp={() => setDragging(false)}
						onDragEnd={() => setDragging(false)}
					>
						<motion.div
							animate={{ scale: dragging ? 1.2 : 1 }}
							transition={{ type: "tween", duration: 0.15 }}
							initial={false}
							className="-mt-2 h-5 w-2 rounded-full bg-zinc-300"
						/>

						<AnimatePresence>
							{dragging && (
								// TODO add background blur so you can always see the time
								<motion.p
									className="absolute text-sm font-medium tracking-wide tabular-nums"
									initial={{ y: 12, opacity: 0 }}
									animate={{ y: 20, opacity: 1 }}
									exit={{ y: [20, 12], opacity: 0 }}
								>
									{unix(currentTime).format("HH:mm")}
								</motion.p>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>

			<div className="mt-4 flex flex-row justify-between">
				{Array.from({ length: legendCount }).map((_, i) => {
					const legendTime = startTime + i * timeInterval;
					return (
						<div key={i} className="text-xs text-zinc-500">
							{unix(legendTime).format("HH:mm")}
						</div>
					);
				})}
			</div>
		</div>
	);
}
