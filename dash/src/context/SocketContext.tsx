"use client";

import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useState,
	useContext,
	useRef,
	MutableRefObject,
} from "react";

import { State } from "../types/state.type";

type Values = {
	state: null | State;
	setState: Dispatch<SetStateAction<Values["state"]>>;

	delay: number;
	setDelay: Dispatch<SetStateAction<Values["delay"]>>;

	connected: boolean;
	setConnected: Dispatch<SetStateAction<Values["connected"]>>;

	ws: MutableRefObject<WebSocket | null>;
};

const SocketContext = createContext<Values | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<null | State>(null);
	const [connected, setConnected] = useState(false);
	const [delay, setDelay] = useState<number>(0);

	const ws = useRef<WebSocket | null>(null);

	return (
		<SocketContext.Provider value={{ state, setState, connected, setConnected, delay, setDelay, ws }}>
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
