import { useRef } from "react";

import { merge } from "@/lib/merge";

import { RecursivePartial } from "@/types/message.type";

type Frame<T> = {
	data: T;
	timestamp: number;
};

export const useBuffer = <T>() => {
	const currentRef = useRef<T | null>(null);
	const bufferRef = useRef<Frame<T>[]>([]);

	const set = (data: T) => {
		currentRef.current = data;
		bufferRef.current = [{ data, timestamp: Date.now() }];
	};

	const push = (update: RecursivePartial<T>) => {
		currentRef.current = merge(currentRef.current ?? {}, update);

		if (currentRef.current) {
			bufferRef.current.push({ data: currentRef.current, timestamp: Date.now() });
		}
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
		for (let i = 0; i < bufferRef.current.length; i++) {
			if (bufferRef.current[i].timestamp < cutoffTime) {
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
		latest,
		delayed,
		cleanup,
		maxDelay,
	};
};
