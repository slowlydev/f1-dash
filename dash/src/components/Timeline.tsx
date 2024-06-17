"use client";

import {
	motion,
	useMotionValue,
	useDragControls,
	AnimatePresence,
	useTransform,
	useMotionTemplate,
} from "framer-motion";

import { useState, useRef, useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";

function getProgressFromX({ x, containerRef }: { x: number; containerRef: MutableRefObject<any> }) {
	let bounds = containerRef.current.getBoundingClientRect();
	let progress = (x - bounds.x) / bounds.width;
	return clamp(progress, 0, 1);
}

function getXFromProgress({ progress, containerRef }: { progress: number; containerRef: MutableRefObject<any> }) {
	let bounds = containerRef.current.getBoundingClientRect();
	return progress * bounds.width;
}

function clamp(number: number, min: number, max: number) {
	return Math.max(min, Math.min(number, max));
}

function useInterval(callback: () => void, delay: number | null) {
	const intervalRef = useRef<null | number>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => savedCallback.current();
		if (typeof delay === "number") {
			intervalRef.current = window.setInterval(tick, delay);
			return () => {
				if (intervalRef.current) {
					window.clearInterval(intervalRef.current);
				}
			};
		}
	}, [delay]);

	return intervalRef;
}

type Props = {
	setTime: Dispatch<SetStateAction<number>>;
	time: number;

	playing: boolean;

	maxDelay: number;
};

export default function Timeline({ playing, maxDelay, time, setTime }: Props) {
	const DURATION = maxDelay;

	let [dragging, setDragging] = useState(false);
	let constraintsRef = useRef<HTMLDivElement | null>(null);
	let fullBarRef = useRef<null | HTMLDivElement>(null);
	let scrubberRef = useRef<null | HTMLButtonElement>(null);
	let scrubberX = useMotionValue(0);
	let currentTimePrecise = useMotionValue(time);
	// let progressPrecise = useTransform(currentTimePrecise, (v) => (v / DURATION) * 100);
	// let progressPreciseWidth = useMotionTemplate`${progressPrecise}%`;
	let dragControls = useDragControls();

	let mins = Math.floor(time / 60);
	let secs = `${time % 60}`.padStart(2, "0");
	let timecode = `${mins}:${secs}`;
	// let minsRemaining = Math.floor((DURATION - currentTime) / 60);
	// let secsRemaining = `${(DURATION - currentTime) % 60}`.padStart(2, "0");
	// let timecodeRemaining = `${minsRemaining}:${secsRemaining}`;
	// let progress = (currentTime / DURATION) * 100;

	useInterval(
		() => {
			if (time < DURATION) {
				setTime((t) => t + 1);
			}
		},
		playing ? 1000 : null,
	);

	useInterval(
		() => {
			if (time < DURATION) {
				currentTimePrecise.set(currentTimePrecise.get() + 0.01);
				let newX = getXFromProgress({
					containerRef: fullBarRef,
					progress: currentTimePrecise.get() / DURATION,
				});
				scrubberX.set(newX);
			}
		},
		playing ? 10 : null,
	);

	return (
		<div className="relative w-full select-none">
			<div
				className="relative"
				onPointerDown={(event) => {
					let newProgress = getProgressFromX({
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

				<div className="absolute inset-0 " ref={constraintsRef}>
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
									className="absolute text-sm font-medium tabular-nums tracking-wide"
									initial={{ y: 12, opacity: 0 }}
									animate={{ y: 20, opacity: 1 }}
									exit={{ y: [20, 12], opacity: 0 }}
								>
									{timecode}
								</motion.p>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>
		</div>
	);
}
