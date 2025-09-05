"use client";

import { useEffect, type ReactNode } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	children: ReactNode;
};

export default function OledModeProvider({ children }: Props) {
	const oledMode = useSettingsStore((state) => state.oledMode);

	useEffect(() => {
		document.documentElement.classList.toggle("bg-zinc-950", !oledMode);
		document.documentElement.classList.toggle("bg-black", oledMode);
	}, [oledMode]);

	return children;
}
