"use client";

import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useState,
	useContext,
	useRef,
	useEffect,
} from "react";
import { utc } from "moment";

import { merge } from "@/lib/merge";
import { inflate } from "@/lib/inflate";

import { env } from "@/env.mjs";

import { useStateEngine } from "@/hooks/useStateEngine";
import { useDevMode } from "@/hooks/useDevMode";

import { CarData, CarsData, Position, Positions, State } from "@/types/state.type";
import { MessageData } from "@/types/message.type";

type Values = {
	connected: boolean;
	setConnected: Dispatch<SetStateAction<Values["connected"]>>;

	handleMessage: (message: MessageData) => void;
	handleInitial: (message: State) => void;

	state: State | null;
	carsData: CarsData | null;
	positions: Positions | null;

	setDelay: (delay: number) => void;
	delay: number;
	maxDelay: number;

	pause: () => void;
	resume: () => void;
};

const SocketContext = createContext<Values | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
	const [connected, setConnected] = useState<boolean>(false);
	const [delay, setDelayI] = useState<number>(0);

	const liveStateRef = useRef<null | State>(null);

	const devMode = useDevMode();

	const stateEngine = useStateEngine<State>("state");
	const carDataEngine = useStateEngine<CarsData>("carData");
	const positionEngine = useStateEngine<Positions>("position");

	const handleInitial = (message: State) => {
		stateEngine.setState(message);
		liveStateRef.current = message;

		if (message.carDataZ) {
			const carData = inflate<CarData>(message.carDataZ);
			carDataEngine.setState(carData.Entries[0].Cars);
			carDataEngine.addFramesWithTimestamp(
				carData.Entries.map((e) => ({ data: e.Cars, timestamp: utc(e.Utc).local().milliseconds() })),
			);
		}

		if (message.positionZ) {
			const position = inflate<Position>(message.positionZ);
			positionEngine.setState(position.Position[0].Entries);
			positionEngine.addFramesWithTimestamp(
				position.Position.map((p) => ({ data: p.Entries, timestamp: utc(p.Timestamp).local().milliseconds() })),
			);
		}
	};

	const handleMessage = (message: MessageData) => {
		liveStateRef.current = merge(liveStateRef.current ?? {}, message);

		if (liveStateRef.current) {
			stateEngine.addFrame(liveStateRef.current);
		}

		if (message.carDataZ) {
			const carData = inflate<CarData>(message.carDataZ);
			carDataEngine.addFramesWithTimestamp(
				carData.Entries.map((e) => ({ data: e.Cars, timestamp: utc(e.Utc).local().valueOf() })),
			);
		}

		if (message.positionZ) {
			const position = inflate<Position>(message.positionZ);
			positionEngine.addFramesWithTimestamp(
				position.Position.map((p) => ({ data: p.Entries, timestamp: utc(p.Timestamp).local().valueOf() })),
			);
		}
	};

	const maxDelay = Math.min(stateEngine.maxDelay, carDataEngine.maxDelay, positionEngine.maxDelay);

	const setDelay = (delay: number) => {
		setDelayI(delay);
		stateEngine.setDelay(delay);
		carDataEngine.setDelay(delay);
		positionEngine.setDelay(delay);
	};

	const pause = () => {
		stateEngine.pause();
		carDataEngine.pause();
		positionEngine.pause();
	};

	const resume = () => {
		stateEngine.resume();
		carDataEngine.resume();
		positionEngine.resume();
	};

	useEffect(() => {
		if (typeof window != undefined) {
			const localStorageDelay = localStorage.getItem("delay");
			if (localStorageDelay) setDelay(parseInt(localStorageDelay));
		}
	}, []);

	// todo ? handle pausing

	return (
		<SocketContext.Provider
			value={{
				connected,
				setConnected,

				handleMessage,
				handleInitial,

				state: stateEngine.state,
				carsData: carDataEngine.state,
				positions: positionEngine.state,

				setDelay,
				delay,
				maxDelay,

				pause,
				resume,
			}}
		>
			{devMode.active && (
				<div className="fixed right-5 top-5 z-50 rounded-lg bg-black p-2 text-sm">
					<pre>Max Delay: {maxDelay}</pre>
					<pre>Current Delay: {delay}</pre>

					<pre>State Engine Buffer: {stateEngine.metrics.bufferLength}</pre>
					<pre>CarData Engine Buffer: {carDataEngine.metrics.bufferLength}</pre>
					<pre>Position Engine Buffer: {positionEngine.metrics.bufferLength}</pre>
				</div>
			)}

			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
}
