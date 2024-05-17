import { useEffect, useRef, useState } from "react";

type Frame<T> = {
	data: T;
	timestamp: number;
};

const sortFrames = <T>(a: Frame<T>, b: Frame<T>) => a.timestamp - b.timestamp;

const MAX_BUFFER = 1000;

export const useStateEngine = <T>(name?: string) => {
	const [state, setState] = useState<T | null>(null);
	const [maxDelay, setMaxDelay] = useState<number>(0);

	const broadcastChannelRef = useRef<BroadcastChannel>(name ? new BroadcastChannel(name) : null);
	const runningRef = useRef<boolean>(true);
	const internalDelayRef = useRef<number>(0);
	const bufferRef = useRef<Frame<T>[]>([]);
	const requestRef = useRef<number | null>(null);

	const addFrame = (data: T) => {
		bufferRef.current.push({ data, timestamp: Date.now() });
		bufferRef.current.sort(sortFrames);

		if (bufferRef.current.length > MAX_BUFFER) {
			bufferRef.current.splice(0, bufferRef.current.length - MAX_BUFFER);
		}
	};

	const addFramesWithTimestamp = (data: { data: T; timestamp: number }[]) => {
		bufferRef.current.push(...data);
		bufferRef.current.sort(sortFrames);

		if (bufferRef.current.length > MAX_BUFFER) {
			bufferRef.current.splice(0, bufferRef.current.length - MAX_BUFFER);
		}
	};

	const animateNextFrame = () => {
		if (runningRef.current) {
			const buffer = bufferRef.current;

			const lastFrame =
				internalDelayRef.current === 0
					? buffer[buffer.length - 1]
					: buffer.find((frame) => frame.timestamp > Date.now() - internalDelayRef.current * 1000);

			if (lastFrame) {
				setState(lastFrame.data);
				broadcastChannelRef.current?.postMessage(lastFrame.data);
			}
		}

		setMaxDelay(bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0);
	};

	useEffect(() => {
		requestRef.current = setInterval(animateNextFrame, 20) as unknown as number;
		return () => (requestRef.current ? clearInterval(requestRef.current) : void 0);
	}, []);

	const setDelay = (delay: number) => {
		internalDelayRef.current = delay;
	};

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
