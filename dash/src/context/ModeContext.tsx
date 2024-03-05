"use client";

import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState, useContext } from "react";

type Mode = "simple" | "advanced" | "expert" | "custom";

type Values = {
	mode: Mode;
	setMode: Dispatch<SetStateAction<Values["mode"]>>;
};

const ModeContext = createContext<Values | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<Mode>("simple");

	return (
		<ModeContext.Provider
			value={{
				mode,
				setMode,
			}}
		>
			{children}
		</ModeContext.Provider>
	);
}

export function useMode() {
	const context = useContext(ModeContext);
	if (context === undefined) {
		throw new Error("useMode must be used within a ModeProvider");
	}
	return context;
}
