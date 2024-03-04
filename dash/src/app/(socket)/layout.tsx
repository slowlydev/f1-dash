"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketProvider, useSocket } from "@/context/SocketContext";

import { env } from "@/env.mjs";

import { messageIsInitial, messageIsUpdate } from "@/lib/messageHelpers";

import { type Message } from "@/types/message.type";

import Navbar from "@/components/Navbar";
import SegmentedControls from "@/components/SegmentedControls";
import DelayInput from "@/components/DelayInput";

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
	const { setConnected, updateState, ws, setInitial, setDelay } = useSocket();

	useEffect(() => {
		const socket = new WebSocket(`${env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

		socket.onclose = () => setConnected(false);
		socket.onopen = () => setConnected(true);

		socket.onmessage = (event) => {
			if (typeof event.data != "string") return;
			const message: Message = JSON.parse(event.data);

			if (Object.keys(message).length === 0) return;

			if (messageIsUpdate(message)) {
				updateState(message);
			}

			if (messageIsInitial(message)) {
				setInitial(message);
			}
		};

		ws.current = socket;

		return () => socket.close();
	}, []);

	const [mode, setMode] = useState<string>("simple");

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 items-center border-b border-zinc-800 bg-black p-2 2xl:grid-cols-3">
				<Navbar />

				<div className="flex items-center justify-center gap-2">
					{/* <Timeline setTime={setTime} time={time} playing={playing} duration={10} /> */}
					{/* <StreamStatus live={true} /> */}
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
					{/* <PlayControls playing={playing} onClick={() => setPlaying((old) => !old)} /> */}
				</div>
			</div>

			<div className="h-max w-full">{children}</div>
		</div>
	);
};
