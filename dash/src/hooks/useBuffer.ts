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
		if (!Number.isFinite(timestamp) || timestamp < 0) return;

		bufferRef.current.push({ data: update, timestamp });
	};

	const latest = (): T | null => {
		const frame = bufferRef.current[bufferRef.current.length - 1];
		return frame ? frame.data : null;
	};

	const delayed = (delayedTime: number): T | null => {
		const buffer = bufferRef.current;
		const length = buffer.length;

		// Handle empty buffer
		if (length === 0) return null;

		// Handle case where all data is newer than delayedTime
		if (buffer[0].timestamp > delayedTime) return null;

		// Handle case where all data is older than delayedTime
		if (buffer[length - 1].timestamp < delayedTime) return buffer[length - 1].data;

		// binary search for the closest frame before delayedTime
		let left = 0;
		let right = length - 1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);

			if (buffer[mid].timestamp <= delayedTime && (mid === length - 1 || buffer[mid + 1].timestamp > delayedTime)) {
				return buffer[mid].data;
			}

			if (buffer[mid].timestamp <= delayedTime) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}

		return null;
	};

	const cleanup = (delayedTime: number) => {
		const buffer = bufferRef.current;
		const cutoffTime = delayedTime - KEEP_BUFFER_SECS * 1000;

		// if buffer is empty, no cleanup is needed
		if (buffer.length === 0) return;

		// if all data is newer than the cutoff, no cleanup needed
		if (buffer[0].timestamp >= cutoffTime) return;

		// find the index of the first frame to keep
		let indexToKeep = 0;
		while (indexToKeep < buffer.length && buffer[indexToKeep].timestamp < cutoffTime) {
			indexToKeep++;
		}

		// keep at least one frame if all frames are older than cutoff
		if (indexToKeep === buffer.length) {
			indexToKeep = buffer.length - 1;
		}

		// remove all obsolete frames at once
		if (indexToKeep > 0) {
			bufferRef.current = buffer.slice(indexToKeep);
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
