"use client";

import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useState,
	useContext,
	useEffect,
} from "react";

export type UiElements = {
	tableHeaders: boolean;
	sectorFastest: boolean;
	carMetrics: boolean;
};

type Mode = "simple" | "advanced" | "expert" | "custom";

type Modes = {
	[key in Mode]: UiElements;
};

const modes: Modes = {
	simple: {
		tableHeaders: false,
		sectorFastest: false,
		carMetrics: false,
	},
	advanced: {
		tableHeaders: true,
		sectorFastest: true,
		carMetrics: false,
	},
	expert: {
		tableHeaders: false,
		sectorFastest: false,
		carMetrics: true,
	},
	custom: {
		tableHeaders: false,
		sectorFastest: false,
		carMetrics: false,
	},
};

type Values = {
	mode: Mode;
	setMode: Dispatch<SetStateAction<Values["mode"]>>;

	uiElements: UiElements;
};

const ModeContext = createContext<Values | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<Mode>("simple");

	useEffect(() => {
		if (typeof window != undefined) {
			const localStorageMode = localStorage.getItem("mode");
			if (localStorageMode && modes[localStorageMode as Mode]) setMode(localStorageMode as Mode);
		}
	}, []);

	useEffect(() => {
		if (typeof window != undefined) {
			localStorage.setItem("mode", mode);
		}
	}, [mode]);

	return (
		<ModeContext.Provider
			value={{
				mode,
				setMode,
				uiElements: modes[mode],
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
