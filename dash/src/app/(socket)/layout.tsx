"use client";

import { ReactNode, useEffect, useState } from "react";

import { env } from "@/env.mjs";

import { SocketProvider, useSocket } from "@/context/SocketContext";
// import { WalkthroughProvider } from "@/context/WalkthroughContext";
import { ModeProvider, useMode } from "@/context/ModeContext";

import { messageIsInitial, messageIsUpdate } from "@/lib/messageHelpers";

import { type Message } from "@/types/message.type";

import Menubar from "@/components/Menubar";
import DelayInput from "@/components/DelayInput";
import PlayControls from "@/components/PlayControls";
import SegmentedControls from "@/components/SegmentedControls";
import StreamStatus from "@/components/StreamStatus";
import { clsx } from "clsx";

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	return (
		<SocketProvider>
			<ModeProvider>
				{/* no walkthrough for now... */}
				<SubLayout>{children}</SubLayout>
			</ModeProvider>
		</SocketProvider>
	);
}

const SubLayout = ({ children }: Props) => {
	const { setConnected, updateState, ws, setInitial, delay, maxDelay, playing } = useSocket();
	const { mode, setMode } = useMode();

	useEffect(() => {
		const socket = new WebSocket(`${env.NEXT_PUBLIC_LIVE_SOCKET_URL}`);

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

	const syncing = maxDelay < delay.current;

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 items-center gap-4 border-b border-zinc-800 bg-black p-2 md:grid-cols-2">
				<Menubar />

				<div className="flex items-center gap-2 sm:hidden">
					{/* <Timeline setTime={setTime} time={time} playing={delay.current > 0} maxDelay={maxDelay} /> */}
					<DelayInput className="flex md:hidden" delay={delay.current} setDebouncedDelay={setDelay} />
					<PlayControls className="flex md:hidden" playing={playback} onClick={() => togglePlayback()} />
					<StreamStatus live={delay.current == 0} />
				</div>

				<div className="flex flex-row-reverse flex-wrap-reverse items-center gap-1">
					<SegmentedControls
						className="w-full md:w-auto"
						id="walkthrough-mode"
						selected={mode}
						onSelect={setMode}
						options={[
							{ label: "Simple", value: "simple" },
							{ label: "Advanced", value: "advanced" },
							{ label: "Expert", value: "expert" },
							{ label: "Custom", value: "custom" },
						]}
					/>
					<DelayInput className="hidden md:flex" delay={delay.current} setDebouncedDelay={setDelay} />
					<PlayControls className="hidden md:flex" playing={playback} onClick={() => togglePlayback()} />
				</div>
			</div>

			{syncing && (
				<div className="flex w-full flex-col items-center justify-center">
					<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
					<p>Please wait for {delay.current - maxDelay} seconds.</p>
					<p>Or make your delay smaller.</p>
				</div>
			)}

			<div className={clsx("h-max w-full", syncing && "hidden")}>{children}</div>
		</div>
	);
};
