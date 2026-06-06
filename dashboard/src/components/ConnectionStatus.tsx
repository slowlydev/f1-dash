"use client";

import clsx from "clsx";

type Props = {
	connected?: boolean;
};

export default function ConnectionStatus({ connected }: Props) {
	return <div className={clsx("size-3 rounded-full", connected ? "bg-emerald-500" : "animate-pulse bg-red-500")} />;
}
