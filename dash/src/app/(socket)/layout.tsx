"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketProvider, useSocket } from "@/context/SocketContext";

import { env } from "@/env.mjs";
import { State } from "@/types/state.type";

import Navbar from "@/components/Navbar";
import DelayInput from "@/components/DelayInput";
import Timeline from "@/components/Timeline";
import StreamStatus from "@/components/StreamStatus";
import PlayControls from "@/components/PlayControls";
import SegmentedControls from "@/components/SegmentedControls";

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
	const { setState, setConnected, delay, setDelay } = useSocket();

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
		const socket = new WebSocket(`${env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

		socket.onclose = () => setConnected(false);
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

	// const maxDelay = buffer.length > 0 ? Math.floor((Date.now() - buffer[0].timestamp) / 1000) : 0;

	const [playing, setPlaying] = useState<boolean>(false);
	const [mode, setMode] = useState<string>("simple");

	return (
		<div className="w-full">
			<div className="grid grid-cols-3 items-center border-b border-zinc-800 bg-black p-2">
				<Navbar />

				<div className="flex items-center justify-center gap-2">
					<Timeline />
					<StreamStatus live={true} />
				</div>

				<div className="flex flex-row-reverse items-center gap-1">
					<SegmentedControls
						options={[
							{ label: "Simple", value: "simple" },
							{ label: "Advanced", value: "advanced" },
							{ label: "Expert", value: "expert" },
							{ label: "Custom", value: "custom" },
						]}
						selected={mode}
						onSelect={setMode}
					/>
					{/* TODO implement setting of user prefered delay */}
					<DelayInput setDebouncedDelay={setDelay} />
					<PlayControls playing={playing} onClick={() => setPlaying((old) => !old)} />
				</div>
			</div>

			<div className="h-max w-full">{children}</div>
		</div>
	);
};
