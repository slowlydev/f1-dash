"use client";

import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	type MutableRefObject,
	createContext,
	useState,
	useContext,
	useRef,
	useEffect,
} from "react";

import { inflate } from "@/lib/inflate";
import { merge } from "@/lib/merge";

import { HistoryType, InitialMessage, UpdateMessage } from "@/types/message.type";
import { CarData, Position, State } from "@/types/state.type";

type Values = {
	state: null | State;

	carData: null | CarData;
	position: null | Position;

	// delay: number;
	// setDelay: Dispatch<SetStateAction<Values["delay"]>>;
	setDelay: (value: number) => void;

	connected: boolean;
	setConnected: Dispatch<SetStateAction<Values["connected"]>>;

	updateState: (message: UpdateMessage) => void;
	setInitial: (initialMessage: InitialMessage) => void;

	ws: MutableRefObject<WebSocket | null>;
};

const SocketContext = createContext<Values | undefined>(undefined);

type Frame = {
	state: null | State;
	carData: null | CarData;
	position: null | Position;
	timestamp: number;
};

export function SocketProvider({ children }: { children: ReactNode }) {
	const [connected, setConnected] = useState(false);
	// const [delay, setDelay] = useState<number>(0);
	const delayRef = useRef<number>(0);

	const [state, setState] = useState<null | State>(null);
	const [carData, setCarData] = useState<null | CarData>(null);
	const [position, setPosition] = useState<null | Position>(null);

	const stateRef = useRef<null | State>(null);
	const carDataRef = useRef<null | CarData>(null);
	const positionRef = useRef<null | Position>(null);

	const bufferRef = useRef<Frame[]>([]);

	const ws = useRef<WebSocket | null>(null);

	const setDelay = (value: number) => {
		delayRef.current = value;
	};

	const setInitial = (initialMessage: InitialMessage) => {
		const initial = initialMessage.initial;
		const carData = initialMessage.initial.carDataZ ? inflate<CarData>(initialMessage.initial.carDataZ) : null;
		const position = initialMessage.initial.positionZ ? inflate<Position>(initialMessage.initial.positionZ) : null;

		stateRef.current = initial;
		carDataRef.current = carData;
		positionRef.current = position;

		addToBuffer(initial, carData, position);
	};

	const updateState = (message: UpdateMessage) => {
		const state = merge(stateRef.current ?? {}, message.update);
		const carData = message.update.carDataZ ? inflate<CarData>(message.update.carDataZ) : null;
		const position = message.update.positionZ ? inflate<Position>(message.update.positionZ) : null;

		stateRef.current = state;
		if (carData) carDataRef.current = carData;
		if (position) positionRef.current = position;

		addToBuffer(state, carData, position);
	};

	const addToBuffer = (state: State | null, carData: CarData | null, position: Position | null) => {
		const newBuffer = [...bufferRef.current, { state, carData, position, timestamp: Date.now() }];
		if (newBuffer.length > 1000) {
			newBuffer.shift();
		}
		bufferRef.current = newBuffer;
	};

	const requestRef = useRef<number | null>(null);

	const animateNextFrame = () => {
		const buffer = bufferRef.current;
		const delay = delayRef.current;
		const isRealtime = delay === 0;
		const lastFrame = isRealtime
			? buffer[buffer.length - 1]
			: buffer.find((frame) => frame.timestamp > Date.now() - delay * 1000);

		if (lastFrame) {
			if (lastFrame.state) setState(lastFrame.state);
			if (lastFrame.carData) setCarData(lastFrame.carData);
			if (lastFrame.position) setPosition(lastFrame.position);
		}

		requestRef.current = requestAnimationFrame(animateNextFrame);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current != null ? cancelAnimationFrame(requestRef.current) : undefined);
	}, []);

	return (
		<SocketContext.Provider
			value={{
				connected,
				setConnected,

				state,
				carData,
				position,

				updateState,
				setInitial,

				setDelay,

				ws,
			}}
		>
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
