"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketProvider, useSocket } from "@/context/SocketContext";

import { env } from "@/env.mjs";
import { State } from "@/types/state.type";

import Navbar from "@/components/Navbar";
import DelayInput from "@/components/DelayInput";
import SessionInfo from "@/components/SessionInfo";
import TrackInfo from "@/components/TrackInfo";
import ConnectionStatus from "@/components/ConnectionStatus";

type BufferFrame = {
	timestamp: number;
	state: State;
	used: boolean;
};

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	return (
		<SocketProvider>
			<SubLayout>{children}</SubLayout>
		</SocketProvider>
	);
}

const SubLayout = ({ children }: Props) => {
	const { state, setState, setConnected, delay, setDelay, connected } = useSocket();

	const MAX_STATE_TRACKER = 1000; // 500
	const [buffer, setBuffer] = useState<BufferFrame[]>([]);

	const addStateToBuffer = (state: State) => {
		setBuffer((prevBuffer) => {
			const newBuffer = [...prevBuffer, { state, timestamp: Date.now(), used: false }];
			if (newBuffer.length > MAX_STATE_TRACKER) {
				newBuffer.shift();
			}
			return newBuffer;
		});
	};

	const getNextFrame = (buffer: BufferFrame[], delay: number): BufferFrame | null => {
		if (buffer.length < 1) return null;
		if (delay < 1) return buffer[buffer.length - 1];

		const timeOffset = Date.now() - delay * 1000;
		const frame = buffer.find((frame) => frame.timestamp >= timeOffset);

		return frame ?? null;
	};

	useEffect(() => {
		setBuffer([]);
		const socket = new EventSource(`${env.NEXT_PUBLIC_SERVER_URL}/api/f1/sse`);

		socket.onerror = () => setConnected(false);
		socket.onopen = () => setConnected(true);

		socket.onmessage = (event) => {
			const state: State = JSON.parse(event.data);

			if (Object.keys(state).length === 0) return;

			addStateToBuffer(state);
		};

		return () => socket.close();
	}, []);

	const [refresher, setRefresher] = useState<number>(0);
	useEffect(() => {
		const refresherLoop = setTimeout(() => {
			setRefresher((prev) => {
				return prev > 100 ? 0 : prev + 1;
			});
		}, 10);

		setState((oldFrame) => {
			const frame = getNextFrame(buffer, delay);
			return frame?.state ?? oldFrame;
		});

		return () => clearTimeout(refresherLoop);
	}, [refresher]);

	const maxDelay = buffer.length > 0 ? Math.floor((Date.now() - buffer[0].timestamp) / 1000) : 0;

	return (
		<div className="w-full">
			<div className="mb-2 flex flex-wrap items-center gap-2">
				<Navbar />

				<div className="flex items-center gap-2">
					<DelayInput setDebouncedDelay={setDelay} maxDelay={maxDelay} />

					<ConnectionStatus connected={connected} />
				</div>
			</div>

			<div className="flex flex-row flex-wrap gap-2">
				<SessionInfo session={state?.session} clock={state?.extrapolatedClock} />

				<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
			</div>

			<div className="h-max w-full">
				{delay > maxDelay && (
					<div className="absolute z-10 h-full w-full">
						<div className="flex h-full w-full flex-col items-center justify-center backdrop-blur-lg">
							<p className="text-3xl font-medium">Syncing, wait for {delay - maxDelay}s</p>
							<p>Or make your delay smaller</p>
						</div>
					</div>
				)}

				{children}
			</div>
		</div>
	);
};
