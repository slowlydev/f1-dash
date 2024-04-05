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

import { InitialMessage, UpdateMessage } from "@/types/message.type";
import { CarData, Position, State } from "@/types/state.type";
import { History } from "@/types/history.type";

import { WindowMessage } from "@/types/window-message.type";
import { WindowKey } from "@/lib/data/windows";
import { createHistoryUpdate, updateHistory } from "../lib/history";

type Values = {
	state: null | State;
	history: null | History;

	carData: null | CarData;
	position: null | Position;

	connected: boolean;
	setConnected: Dispatch<SetStateAction<Values["connected"]>>;

	updateState: (message: UpdateMessage) => void;
	setInitial: (initialMessage: InitialMessage) => void;

	openSubWindow: (key: WindowKey) => void;

	ws: MutableRefObject<WebSocket | null>;
	playing: MutableRefObject<boolean>;
	delay: MutableRefObject<number>;
	maxDelay: number;
};

const SocketContext = createContext<Values | undefined>(undefined);

type Frame = {
	state: null | State;
	history: null | History;

	carData: null | CarData;
	position: null | Position;

	timestamp: number;
};

export function SocketProvider({ children }: { children: ReactNode }) {
	const [connected, setConnected] = useState<boolean>(false);

	const bufferRef = useRef<Frame[]>([]);

	const delay = useRef<number>(0);
	const playing = useRef<boolean>(true);
	const ws = useRef<WebSocket | null>(null);

	const [state, setState] = useState<null | State>(null);
	const [history, setHistory] = useState<null | History>(null);
	const [carData, setCarData] = useState<null | CarData>(null);
	const [position, setPosition] = useState<null | Position>(null);

	const stateRef = useRef<null | State>(null);
	const historyRef = useRef<null | History>(null);
	const carDataRef = useRef<null | CarData>(null);
	const positionRef = useRef<null | Position>(null);

	const subWindowsRef = useRef<Window[]>([]);

	const setInitial = (initialMessage: InitialMessage) => {
		const initial = initialMessage.initial;
		const history = initialMessage.history;
		const carData = initial.carDataZ ? inflate<CarData>(initial.carDataZ) : null;
		const position = initial.positionZ ? inflate<Position>(initial.positionZ) : null;

		stateRef.current = initial;
		historyRef.current = history;
		carDataRef.current = carData;
		positionRef.current = position;

		addToBuffer(initial, carData, position, history);
	};

	const updateState = (message: UpdateMessage) => {
		const state: State = merge(stateRef.current ?? {}, message.update);

		const sessionPart = state.timingData?.sessionPart;
		const history = updateHistory(historyRef.current ?? {}, createHistoryUpdate(message.update, sessionPart));
		const carData = message.update.carDataZ ? inflate<CarData>(message.update.carDataZ) : null;
		const position = message.update.positionZ ? inflate<Position>(message.update.positionZ) : null;

		stateRef.current = state;
		historyRef.current = history;
		if (carData) carDataRef.current = carData;
		if (position) positionRef.current = position;

		addToBuffer(state, carData, position, history);
	};

	const addToBuffer = (
		state: State | null,
		carData: CarData | null,
		position: Position | null,
		history: null | History,
	) => {
		const newBuffer = [...bufferRef.current, { state, history, carData, position, timestamp: Date.now() }];
		if (newBuffer.length > 1000) {
			newBuffer.shift();
		}
		bufferRef.current = newBuffer;
	};

	const requestRef = useRef<number | null>(null);

	const animateNextFrame = () => {
		if (playing.current) {
			const buffer = bufferRef.current;
			const isRealtime = delay.current === 0;
			const lastFrame = isRealtime
				? buffer[buffer.length - 1]
				: buffer.find((frame) => frame.timestamp > Date.now() - delay.current * 1000);

			if (lastFrame) {
				if (lastFrame.state) {
					setState(lastFrame.state);
					broadcastToWindows({ updateType: "state", state: lastFrame.state });
				}
				if (lastFrame.history) {
					setHistory(lastFrame.history);
					// we do not have to broadcast history yet, and lets save on compute for now
				}
				if (lastFrame.carData) {
					setCarData(lastFrame.carData);
					broadcastToWindows({ updateType: "car-data", carData: lastFrame.carData });
				}
				if (lastFrame.position) {
					setPosition(lastFrame.position);
					broadcastToWindows({ updateType: "position", position: lastFrame.position });
				}
			}
		}

		requestRef.current = requestAnimationFrame(animateNextFrame);
	};

	useEffect(() => {
		if (typeof window != undefined) {
			const localStorageDelay = localStorage.getItem("delay");
			if (localStorageDelay) delay.current = parseInt(localStorageDelay);
		}
	}, []);

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animateNextFrame);

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}

			subWindowsRef.current.forEach((subWindow) => subWindow.close());
		};
	}, []);

	const maxDelay = bufferRef.current.length > 0 ? Math.floor((Date.now() - bufferRef.current[0].timestamp) / 1000) : 0;

	const openSubWindow = (key: WindowKey) => {
		let newSubWindow = window.open(`/window/${key}`, undefined, "popup=yes,left=100,top=100,width=320,height=320");

		if (newSubWindow) {
			subWindowsRef.current = [...subWindowsRef.current, newSubWindow];
		}
	};

	const broadcastToWindows = (message: WindowMessage) => {
		subWindowsRef.current.forEach((subWindow) => subWindow.postMessage(message));
	};

	return (
		<SocketContext.Provider
			value={{
				connected,
				setConnected,

				state,
				carData,
				position,
				history,

				updateState,
				setInitial,

				openSubWindow,

				maxDelay,
				delay,

				playing,

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
