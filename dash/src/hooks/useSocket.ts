import { useEffect, useState } from "react";

import type { MessageInitial, MessageUpdate } from "@/types/message.type";

import { env } from "@/env";

type Props = {
	handleInitial: (data: MessageInitial) => void;
	handleUpdate: (data: MessageUpdate) => void;
};

export const useSocket = ({ handleInitial, handleUpdate }: Props) => {
	const [connected, setConnected] = useState<boolean>(false);

	useEffect(() => {
		const sse = new EventSource(`${env.NEXT_PUBLIC_LIVE_URL}/api/sse`);

		sse.onerror = () => setConnected(false);
		sse.onopen = () => setConnected(true);

		sse.addEventListener("initial", (message) => {
			handleInitial(JSON.parse(message.data));
		});

		sse.addEventListener("update", (message) => {
			handleUpdate(JSON.parse(message.data));
		});

		return () => sse.close();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { connected };
};
