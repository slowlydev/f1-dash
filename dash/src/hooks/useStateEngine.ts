import { useEffect, useRef, useState } from "react";

type Frame<T> = {
	data: T;
	timestamp: number;
};

const sortFrames = <T>(a: Frame<T>, b: Frame<T>) => a.timestamp - b.timestamp;

const UPDATE_MS = 30;
const KEEP_BUFFER_SECS = 5;

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
		if (time - lastRef.current <= UPDATE_MS) {
			requestRef.current = requestAnimationFrame(animateNextFrame);
			return;
		}

		if (!runningRef.current) {
			requestRef.current = requestAnimationFrame(animateNextFrame);
			return;
		}

		const buffer = bufferRef.current;
		const delay = delayRef.current;

		if (delay === 0) {
			const lastFrame = buffer[buffer.length - 1];
			if (lastFrame) {
				setState(lastFrame.data);
				broadcastRef.current?.postMessage(lastFrame.data);
			}
		} else {
			const delayedTimestamp = Date.now() - delay * 1000;
			const lastFrame = buffer.find((frame) => frame.timestamp > delayedTimestamp);

			if (lastFrame) {
				setState(lastFrame.data);
				broadcastRef.current?.postMessage(lastFrame.data);

				bufferRef.current = buffer.filter((frame) => frame.timestamp >= lastFrame.timestamp - KEEP_BUFFER_SECS * 1000);
			}
		}

		setMaxDelay(bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0);

		lastRef.current = time;
		requestRef.current = requestAnimationFrame(animateNextFrame);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => {
			requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0;
			broadcastRef.current?.close();
		};
	}, []);

	const addFrame = (data: T) => {
		bufferRef.current.push({ data, timestamp: Date.now() });
	};

	const addFramesWithTimestamp = (data: Frame<T>[]) => {
		const incoming = data.sort(sortFrames);
		bufferRef.current.push(...incoming);
	};

	return {
		state,
		setState,
		addFrame,
		addFramesWithTimestamp,
		setDelay: (delay: number) => (delayRef.current = delay),
		maxDelay,
		pause: () => (runningRef.current = false),
		resume: () => (runningRef.current = true),
		metrics: {
			bufferLength: bufferRef.current.length,
			running: runningRef.current,
		},
	};
};
