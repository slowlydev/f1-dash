"use client";

import { InitialMessage, UpdateMessage } from "@/types/message.type";
import { CarData, Position, State } from "@/types/state.type";
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

type Values = {
	state: null | State;

	carData: null | CarData;
	position: null | Position;

	history: null | History;

	delay: number;
	setDelay: Dispatch<SetStateAction<Values["delay"]>>;

	connected: boolean;
	setConnected: Dispatch<SetStateAction<Values["connected"]>>;

	updateState: (message: UpdateMessage) => void;
	setInitial: (initialMessage: InitialMessage) => void;

	ws: MutableRefObject<WebSocket | null>;
};

const SocketContext = createContext<Values | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
	const [history, setHistory] = useState<null | History>(null);

	const [connected, setConnected] = useState(false);
	const [delay, setDelay] = useState<number>(0);

	const [state, setState] = useState<null | State>(null);
	const [carData, setCarData] = useState<null | CarData>(null);
	const [position, setPosition] = useState<null | Position>(null);

	const ws = useRef<WebSocket | null>(null);

	const setInitial = (initialMessage: InitialMessage) => {
		setState(initialMessage.initial);

		if (initialMessage.initial.carDataZ) {
			setCarData(inflate(initialMessage.initial.carDataZ));
		}
		if (initialMessage.initial.positionZ) {
			setPosition(inflate(initialMessage.initial.positionZ));
		}
	};

	const updateState = (message: UpdateMessage) => {
		setState((oldState) => {
			return merge(oldState ?? {}, message.update) ?? oldState;
		});

		if (message.update.carDataZ) {
			setCarData(inflate(message.update.carDataZ));
		}
		if (message.update.positionZ) {
			setPosition(inflate(message.update.positionZ));
		}
	};

	return (
		<SocketContext.Provider
			value={{
				connected,
				setConnected,

				history,

				state,
				carData,
				position,

				updateState,
				setInitial,

				delay,
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
