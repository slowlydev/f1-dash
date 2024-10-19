"use client";

import { type MutableRefObject, useEffect, useRef, useState } from "react";

import type { CarData, CarsData, Position, Positions, State } from "@/types/state.type";
import type { MessageInitial, MessageUpdate } from "@/types/message.type";

import { merge } from "@/lib/merge";
import { inflate } from "@/lib/inflate";
import { utcToLocalMs } from "@/lib/utcToLocalMs";

import { useDataStore } from "@/stores/useDataStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useLapStore } from "@/stores/useLapStore";

const UPDATE_MS = 200;
const KEEP_BUFFER_SECS = 5;

type Frame<T> = {
	data: T;
	timestamp: number;
};

const cleanupBuffer = (buffer: MutableRefObject<Frame<any>[]>, frameTimestamp: number) => {
	buffer.current = buffer.current.filter((frame) => frame.timestamp >= frameTimestamp - KEEP_BUFFER_SECS * 1000);
};

const maxBufferDelay = (buffer: MutableRefObject<Frame<any>[]>): number => {
	return buffer.current.length > 0 ? Math.floor((Date.now() - buffer.current[0].timestamp) / 1000) : 0;
};

export const useDataEngine = () => {
	const dataStore = useDataStore();
	const historyStore = useHistoryStore();
	const lapStore = useLapStore();

	const [maxDelay, setMaxDelay] = useState<number>(0);

	const stateRef = useRef<null | State>(null);
	const delayRef = useRef<number>(0);

	const stateBuffer = useRef<Frame<State>[]>([]);
	const carBuffer = useRef<Frame<CarsData>[]>([]);
	const posBuffer = useRef<Frame<Positions>[]>([]);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInitial = ({ carDataZ, positionZ, ...message }: MessageInitial) => {
		dataStore.setState(message);
		stateRef.current = message;
		stateBuffer.current = [{ data: message, timestamp: Date.now() }];

		if (carDataZ) {
			const carData = inflate<CarData>(carDataZ);
			dataStore.setCarsData(carData.Entries[0].Cars);
			carBuffer.current = carData.Entries.map((e) => ({ data: e.Cars, timestamp: utcToLocalMs(e.Utc) }));
		}

		if (positionZ) {
			const position = inflate<Position>(positionZ);
			dataStore.setPositions(position.Position[0].Entries);
			posBuffer.current = position.Position.map((p) => ({ data: p.Entries, timestamp: utcToLocalMs(p.Timestamp) }));
		}
	};

	const handleUpdate = ({ carDataZ, positionZ, ...update }: MessageUpdate) => {
		stateRef.current = merge(stateRef.current ?? {}, update);

		if (stateRef.current) {
			stateBuffer.current.push({ data: stateRef.current, timestamp: Date.now() });
		}

		if (carDataZ) {
			const carData = inflate<CarData>(carDataZ);
			carBuffer.current.push(...carData.Entries.map((e) => ({ data: e.Cars, timestamp: utcToLocalMs(e.Utc) })));
		}

		if (positionZ) {
			const position = inflate<Position>(positionZ);
			posBuffer.current.push(
				...position.Position.map((p) => ({ data: p.Entries, timestamp: utcToLocalMs(p.Timestamp) })),
			);
		}
	};

	const handleCurrentState = () => {
		const delay = delayRef.current;

		if (delay === 0) {
			const stateFrame = stateBuffer.current[stateBuffer.current.length - 1];
			if (stateFrame) dataStore.setState(stateFrame.data);

			const carFrame = carBuffer.current[carBuffer.current.length - 1];
			if (carFrame) dataStore.setCarsData(carFrame.data);

			const posFrame = posBuffer.current[posBuffer.current.length - 1];
			if (posFrame) dataStore.setPositions(posFrame.data);
		} else {
			const delayedTimestamp = Date.now() - delay * 1000;

			const stateFrame = stateBuffer.current.find((frame) => frame.timestamp > delayedTimestamp);

			if (stateFrame) {
				dataStore.setState(stateFrame.data);
				cleanupBuffer(stateBuffer, stateFrame.timestamp);
			}

			const carFrame = carBuffer.current.find((frame) => frame.timestamp > delayedTimestamp);

			if (carFrame) {
				dataStore.setCarsData(carFrame.data);
				cleanupBuffer(carBuffer, carFrame.timestamp);
			}

			const posFrame = posBuffer.current.find((frame) => frame.timestamp > delayedTimestamp);

			if (posFrame) {
				dataStore.setPositions(posFrame.data);
				cleanupBuffer(posBuffer, posFrame.timestamp);
			}
		}

		const maxDelay = Math.min(maxBufferDelay(stateBuffer), maxBufferDelay(carBuffer), maxBufferDelay(posBuffer));
		setMaxDelay(maxDelay);
	};

	useEffect(() => {
		intervalRef.current = setInterval(handleCurrentState, UPDATE_MS);
		return () => (intervalRef.current ? clearInterval(intervalRef.current) : void 0);
	}, []);

	return {
		handleUpdate,
		handleInitial,
		maxDelay,
	};
};
