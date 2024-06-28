import { useEffect, useRef, useState } from "react";

type Frame<T> = {
	data: T;
	timestamp: number;
};

const sortFrames = <T>(a: Frame<T>, b: Frame<T>) => a.timestamp - b.timestamp;

const BUFFER_LOW = 800;
const BUFFER_HIGH = 1000;
const UPDATE_MS = 30;

export const useStateEngine = <T>(name?: string) => {
	const [state, setState] = useState<T | null>(null);

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
		}

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

		if (bufferRef.current.length > BUFFER_HIGH) {
			bufferRef.current.splice(0, bufferRef.current.length - BUFFER_LOW);

			// let's only sort when we have to cut, to save some mutations on the buffer
			bufferRef.current.sort(sortFrames);
		}
	};

	const addFramesWithTimestamp = (data: Frame<T>[]) => {
		const incoming = data.sort(sortFrames);
		bufferRef.current.push(...incoming);

		if (bufferRef.current.length > BUFFER_HIGH) {
			bufferRef.current.splice(0, bufferRef.current.length - BUFFER_LOW);
		}
	};

	return {
		state,
		setState,
		addFrame,
		addFramesWithTimestamp,
		setDelay: (delay: number) => (delayRef.current = delay),
		maxDelay: bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0,
		pause: () => (runningRef.current = false),
		resume: () => (runningRef.current = true),
		metrics: {
			bufferLength: bufferRef.current.length,
			running: runningRef.current,
		},
	};
};
