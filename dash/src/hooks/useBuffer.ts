import { useRef } from "react";

const KEEP_BUFFER_SECS = 5;

type Frame<T> = {
	data: T;
	timestamp: number;
};

export const useBuffer = <T>() => {
	const bufferRef = useRef<Frame<T>[]>([]);

	const set = (data: T) => {
		bufferRef.current = [{ data, timestamp: Date.now() }];
	};

	const push = (update: T) => {
		bufferRef.current.push({ data: update, timestamp: Date.now() });
	};

	const pushTimed = (update: T, timestamp: number) => {
		bufferRef.current.push({ data: update, timestamp });
	};

	const latest = (): T | null => {
		const frame = bufferRef.current[bufferRef.current.length - 1];
		return frame ? frame.data : null;
	};

	const delayed = (cutoffTime: number) => {
		for (let i = 0; i < bufferRef.current.length; i++) {
			if (bufferRef.current[i].timestamp >= cutoffTime) {
				return bufferRef.current[i].data;
			}
		}

		return null;
	};

	const cleanup = (cutoffTime: number) => {
		const bufferedCutOff = cutoffTime - KEEP_BUFFER_SECS * 1000;

		for (let i = 0; i < bufferRef.current.length; i++) {
			if (bufferRef.current[i].timestamp < bufferedCutOff) {
				bufferRef.current.splice(i, 1);
			}
		}
	};

	const maxDelay = (): number => {
		return bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0;
	};

	return {
		set,
		push,
		pushTimed,
		latest,
		delayed,
		cleanup,
		maxDelay,
	};
};
