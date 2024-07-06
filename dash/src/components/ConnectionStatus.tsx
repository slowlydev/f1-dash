"use client";

import clsx from "clsx";
import { useSocket } from "@/context/SocketContext";

export default function ConnectionStatus() {
	const { connected } = useSocket();

	return <div className={clsx("size-3 rounded-full", connected ? "bg-emerald-500" : "animate-pulse bg-red-500")} />;
}
