"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";

import { useDataEngine } from "@/hooks/useDataEngine";
import { useSocket } from "@/hooks/useSocket";

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	const { handleInitial, handleUpdate } = useDataEngine();

	useSocket({ handleInitial, handleUpdate });

	return (
		<div className="w-full">
			<div className={clsx("h-max w-full")}>{children}</div>
		</div>
	);
}
