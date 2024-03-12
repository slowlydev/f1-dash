"use client";

import { ReactNode, useEffect, useState } from "react";

import { env } from "@/env.mjs";

import { SocketProvider, useSocket } from "@/context/SocketContext";
import { WalkthroughProvider } from "@/context/WalkthroughContext";
import { ModeProvider, useMode } from "@/context/ModeContext";

import { messageIsInitial, messageIsUpdate } from "@/lib/messageHelpers";

import { type Message } from "@/types/message.type";

import Menubar from "@/components/Menubar";
import DelayInput from "@/components/DelayInput";
import PlayControls from "@/components/PlayControls";
import SegmentedControls from "@/components/SegmentedControls";

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	return (
		<SocketProvider>
			<ModeProvider>
				<WalkthroughProvider>
					<SubLayout>{children}</SubLayout>
				</WalkthroughProvider>
			</ModeProvider>
		</SocketProvider>
	);
}

const SubLayout = ({ children }: Props) => {
	const { setConnected, updateState, ws, setInitial, delay, playing, maxDelay } = useSocket();
	const { mode, setMode } = useMode();

	useEffect(() => {
		const socket = new WebSocket(`${env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

		socket.onerror = () => setConnected(false);
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

	const [pausedTime, setPausedTime] = useState<number>(0);
	const [playback, setPlayback] = useState<boolean>(true);

	const togglePlayback = () => {
		setPlayback((old) => {
			if (old) {
				setPausedTime(Date.now());
			} else {
				setDelay(Math.round((Date.now() - pausedTime) / 1000) + delay.current);
			}

			playing.current = !playing.current;

			return !old;
		});
	};

	const setDelay = (newDelay: number) => {
		if (newDelay === 0) {
			playing.current = true;
			setPausedTime(0);
		}

		delay.current = newDelay;

		if (typeof window != undefined) {
			localStorage.setItem("delay", `${newDelay}`);
		}
	};

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 items-center gap-4 border-b border-zinc-800 bg-black p-2 md:grid-cols-2">
				<Menubar />

				{/* <div className="flex items-center justify-center gap-2">
					<Timeline setTime={setTime} time={time} playing={delay.current > 0} maxDelay={maxDelay} />
					<StreamStatus live={delay.current == 0} />
				</div> */}

				<div className="flex flex-row-reverse items-center gap-1">
					<SegmentedControls
						selected={mode}
						onSelect={setMode}
						options={[
							{ label: "Simple", value: "simple" },
							{ label: "Advanced", value: "advanced" },
							{ label: "Expert", value: "expert" },
							{ label: "Custom", value: "custom" },
						]}
					/>
					{/* TODO implement setting of user prefered delay */}
					<DelayInput delay={delay.current} setDebouncedDelay={setDelay} />
					<PlayControls playing={playback} onClick={() => togglePlayback()} />
				</div>
			</div>

			<div className="h-max w-full">{children}</div>
		</div>
	);
};
