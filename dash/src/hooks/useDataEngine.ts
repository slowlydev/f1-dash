"use client";

import { type MutableRefObject, useEffect, useRef, useState } from "react";

import type { CarData, CarsData, Position, Positions } from "@/types/state.type";
import type { MessageInitial, MessageUpdate } from "@/types/message.type";

import { inflate } from "@/lib/inflate";
import { utcToLocalMs } from "@/lib/utcToLocalMs";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore, useCarDataStore, usePositionStore } from "@/stores/useDataStore";

import { useBuffer } from "@/hooks/useBuffer";

const UPDATE_MS = 200;
const KEEP_BUFFER_SECS = 5;

type Frame<T> = {
	data: T;
	timestamp: number;
};

const maxBufferDelay = (buffer: MutableRefObject<Frame<any>[]>): number => {
	return buffer.current.length > 0 ? Math.floor((Date.now() - buffer.current[0].timestamp) / 1000) : 0;
};

const cleanupBuffer = (buffer: MutableRefObject<Frame<any>[]>, frameTimestamp: number) => {
	const cutoffTime = frameTimestamp - KEEP_BUFFER_SECS * 1000;

	for (let i = 0; i < buffer.current.length; i++) {
		if (buffer.current[i].timestamp < cutoffTime) {
			buffer.current.splice(i, 1);
		}
	}
};

const bufferTypes = [
	"extrapolatedClock",
	"topThree",
	"timingStats",
	"timingAppData",
	"weatherData",
	"trackStatus",
	"driverList",
	"raceControlMessages",
	"sessionInfo",
	"sessionData",
	"lapCount",
	"timingData",
	"teamRadio",
	"championshipPrediction",
];

type Buffers = Record<(typeof bufferTypes)[number], ReturnType<typeof useBuffer>>;

export const useDataEngine = () => {
	// const historyStore = useHistoryStore();
	// const lapStore = useLapStore();

	const dataStore = useDataStore();
	const carDataStore = useCarDataStore();
	const positionStore = usePositionStore();

	const buffers = bufferTypes.reduce<Buffers>((acc, type) => {
		acc[type] = useBuffer();
		return acc;
	}, {} as Buffers);

	const [maxDelay, setMaxDelay] = useState<number>(0);

	const delayRef = useRef<number>(0);

	useSettingsStore.subscribe(
		(state) => state.delay,
		(delay) => {
			delayRef.current = delay;
			console.log(delay);
		},
		{ fireImmediately: true },
	);

	const carBuffer = useRef<Frame<CarsData>[]>([]);
	const posBuffer = useRef<Frame<Positions>[]>([]);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInitial = ({ carDataZ, positionZ, ...initial }: MessageInitial) => {
		dataStore.set(initial);

		Object.keys(buffers).forEach((key) => {
			const data = initial[key as keyof typeof initial];
			const buffer = buffers[key as keyof typeof buffers];
			if (data) buffer.set(data);
		});

		if (carDataZ) {
			const carData = inflate<CarData>(carDataZ);
			carDataStore.set(carData.Entries[0].Cars);

			for (const entry of carData.Entries) {
				carBuffer.current.push({ data: entry.Cars, timestamp: utcToLocalMs(entry.Utc) });
			}
		}

		if (positionZ) {
			const position = inflate<Position>(positionZ);
			positionStore.set(position.Position[0].Entries);

			for (const entry of position.Position) {
				posBuffer.current.push({ data: entry.Entries, timestamp: utcToLocalMs(entry.Timestamp) });
			}
		}
	};

	const handleUpdate = ({ carDataZ, positionZ, ...update }: MessageUpdate) => {
		Object.keys(buffers).forEach((key) => {
			const data = update[key as keyof typeof update];
			const buffer = buffers[key as keyof typeof buffers];
			if (data) buffer.push(data);
		});

		if (carDataZ) {
			const carData = inflate<CarData>(carDataZ);
			for (const entry of carData.Entries) {
				carBuffer.current.push({ data: entry.Cars, timestamp: utcToLocalMs(entry.Utc) });
			}
		}

		if (positionZ) {
			const position = inflate<Position>(positionZ);
			for (const entry of position.Position) {
				posBuffer.current.push({ data: entry.Entries, timestamp: utcToLocalMs(entry.Timestamp) });
			}
		}
	};

	const handleCurrentState = () => {
		const delay = delayRef.current;

		if (delay === 0) {
			Object.keys(buffers).forEach((key) => {
				const buffer = buffers[key as keyof typeof buffers];
				const latest = buffer.latest();
				if (latest) dataStore.set({ [key]: latest });
			});

			const carFrame = carBuffer.current[carBuffer.current.length - 1];
			if (carFrame) carDataStore.set(carFrame.data);

			const posFrame = posBuffer.current[posBuffer.current.length - 1];
			if (posFrame) positionStore.set(posFrame.data);
		} else {
			const delayedTimestamp = Date.now() - delay * 1000;

			Object.keys(buffers).forEach((key) => {
				const buffer = buffers[key as keyof typeof buffers];
				const delayed = buffer.delayed(delayedTimestamp);
				if (delayed) dataStore.set({ [key]: delayed });
				setTimeout(() => buffer.cleanup(delayedTimestamp), 0);
			});

			const carFrame = carBuffer.current.find((frame) => frame.timestamp >= delayedTimestamp);
			console.log("carFrame", carFrame);
			if (carFrame) {
				carDataStore.set(carFrame.data);
				cleanupBuffer(carBuffer, carFrame.timestamp);
			}

			const posFrame = posBuffer.current.find((frame) => frame.timestamp >= delayedTimestamp);
			console.log("posFrame", carFrame);
			if (posFrame) {
				positionStore.set(posFrame.data);
				cleanupBuffer(posBuffer, posFrame.timestamp);
			}
		}

		const maxDelay = Math.max(
			...Object.values(buffers).map((buffer) => buffer.maxDelay()),
			maxBufferDelay(carBuffer),
			maxBufferDelay(posBuffer),
		);

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
