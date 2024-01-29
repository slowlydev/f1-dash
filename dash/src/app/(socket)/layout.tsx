"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketProvider, useSocket } from "@/context/SocketContext";

import { env } from "@/env.mjs";
import { State } from "@/types/state.type";
import { BackendState } from "@/types/backend-state.type";

import { transfrom } from "@/lib/transformer";

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

	useEffect(() => {
		const socket = new WebSocket(`${env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

		socket.binaryType = "arraybuffer";

		socket.onclose = () => setConnected(false);
		socket.onopen = () => setConnected(true);

		socket.onmessage = (event) => {
			let uint8Array = new Uint8Array(event.data);
			let text = new TextDecoder().decode(uint8Array);

			const state: BackendState = JSON.parse(text);

			if (Object.keys(state).length === 0) return;

			setState(transfrom(state));
		};

		return () => socket.close();
	}, []);

	const [playing, setPlaying] = useState<boolean>(false);
	const [mode, setMode] = useState<string>("simple");
	const [time, setTime] = useState<number>(0);

	return (
		<div className="w-full">
			<div className="grid grid-cols-3 items-center border-b border-zinc-800 bg-black p-2">
				<Navbar />

				<div className="flex items-center justify-center gap-2">
					<Timeline setTime={setTime} time={time} playing={playing} duration={10} />
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
