import { useEffect, useState } from "react";

import type { MessageInitial, MessageUpdate } from "@/types/message.type";

import { inflate } from "@/lib/inflate";

import { env } from "@/env.mjs";

type Props = {
	handleInitial: (data: MessageInitial) => void;
	handleUpdate: (data: MessageUpdate) => void;
};

export const useSocket = ({ handleInitial, handleUpdate }: Props) => {
	const [connected, setConnected] = useState<boolean>(false);

	useEffect(() => {
		const sse = new EventSource(`${env.NEXT_PUBLIC_LIVE_SOCKET_URL}/api/sse`);

		sse.onerror = () => setConnected(false);
		sse.onopen = () => setConnected(true);

		sse.addEventListener("initial", (message) => {
			const decompressed = inflate<MessageInitial>(message.data);
			handleInitial(decompressed);
		});

		sse.addEventListener("update", (message) => {
			const decompressed = inflate<MessageUpdate>(message.data);
			handleUpdate(decompressed);
		});

		return () => sse.close();
	}, []);

	return { connected };
};
