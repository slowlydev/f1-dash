import { useEffect, useRef, useState } from "react";

type Frame<T> = {
	data: T;
	timestamp: number;
};

const sortFrames = <T>(a: Frame<T>, b: Frame<T>) => a.timestamp - b.timestamp;

const MAX_BUFFER = 1000;
const UPDATE_MS = 30;

export const useStateEngine = <T>(name?: string) => {
	const [state, setState] = useState<T | null>(null);
	const [maxDelay, setMaxDelay] = useState<number>(0);

	const broadcastRef = useRef<BroadcastChannel>(name ? new BroadcastChannel(name) : null);

	const bufferRef = useRef<Frame<T>[]>([]);
	const runningRef = useRef<boolean>(true);
	const delayRef = useRef<number>(0);

	const requestRef = useRef<number | null>(null);
	const lastRef = useRef<number>(0);

	const animateNextFrame = (time: number) => {
		if (time - lastRef.current > UPDATE_MS) {
			if (runningRef.current) {
				const buffer = bufferRef.current;

				const lastFrame =
					delayRef.current === 0
						? buffer[buffer.length - 1]
						: buffer.find((frame) => frame.timestamp > Date.now() - delayRef.current * 1000);

				if (lastFrame) {
					setState(lastFrame.data);
					broadcastRef.current?.postMessage(lastFrame.data);
				}
			}

			lastRef.current = time;
			setMaxDelay(bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0);
		}

		requestRef.current = requestAnimationFrame(animateNextFrame);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	}, []);

	const addFrame = (data: T) => {
		bufferRef.current.push({ data, timestamp: Date.now() });
		bufferRef.current.sort(sortFrames);

		if (bufferRef.current.length > MAX_BUFFER) {
			bufferRef.current.splice(0, bufferRef.current.length - MAX_BUFFER);
		}
	};

	const addFramesWithTimestamp = (data: Frame<T>[]) => {
		bufferRef.current.push(...data);
		bufferRef.current.sort(sortFrames);

		if (bufferRef.current.length > MAX_BUFFER) {
			bufferRef.current.splice(0, bufferRef.current.length - MAX_BUFFER);
		}
	};

	const setDelay = (delay: number) => (delayRef.current = delay);

	const pause = () => (runningRef.current = false);
	const resume = () => (runningRef.current = true);

	return {
		state,
		setState,
		addFrame,
		addFramesWithTimestamp,
		setDelay,
		maxDelay,
		pause,
		resume,
		metrics: {
			bufferLength: bufferRef.current.length,
			running: runningRef.current,
		},
	};
};
