"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

export default function OledModeProvider({ children }: Props) {
    const oledMode = useSettingsStore((state) => state.oledMode);

    useEffect(() => {
        document.documentElement.classList.toggle("bg-zinc-950", !oledMode);
        document.documentElement.classList.toggle("bg-black", oledMode);
    }, [oledMode]);

    return <div className={oledMode ? "bg-black" : "bg-zinc-950"}>{children}</div>;
}