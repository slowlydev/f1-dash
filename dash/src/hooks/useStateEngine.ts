import { useEffect, useRef, useState } from "react";

type Frame<T> = {
	data: T;
	timestamp: number;
};

export const useStateEngine = <T>(name?: string) => {
	const [state, setState] = useState<T | null>(null);
	const [maxDelay, setMaxDelay] = useState<number>(0);

	const broadcastChannelRef = useRef<BroadcastChannel>(name ? new BroadcastChannel(name) : null);
	const runningRef = useRef<boolean>(true);
	const internalDelayRef = useRef<number>(0);
	const bufferRef = useRef<Frame<T>[]>([]);
	const requestRef = useRef<number | null>(null);

	const addFrame = (data: T) => {
		const newBuffer = [...bufferRef.current, { data, timestamp: Date.now() }];
		if (newBuffer.length > 1000) newBuffer.shift();
		bufferRef.current = newBuffer;
	};

	const addFramesWithTimestamp = (data: { data: T; timestamp: number }[]) => {
		const newBuffer = [...bufferRef.current, ...data];
		if (newBuffer.length > 1000) newBuffer.shift();
		bufferRef.current = newBuffer;
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

		// requestRef.current = requestAnimationFrame(animateNextFrame);
	};

	useEffect(() => {
		requestRef.current = setInterval(animateNextFrame, 20) as unknown as number;
		return () => (requestRef.current ? clearInterval(requestRef.current) : void 0);

		// requestRef.current = requestAnimationFrame(animateNextFrame);
		// return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	}, []);

	const setDelay = (delay: number) => {
		internalDelayRef.current = delay;
	};

	const pause = () => (runningRef.current = false);
	const resume = () => (runningRef.current = true);

	return {
		state,
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
