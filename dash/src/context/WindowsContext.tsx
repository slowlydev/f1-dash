"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef } from "react";

import { WindowKey } from "@/lib/data/windows";

type Values = {
	openWindow: (key: WindowKey) => void;
};

const WindowsContext = createContext<Values | undefined>(undefined);

export function WindowsProvider({ children }: { children: ReactNode }) {
	const subWindowsRef = useRef<Window[]>([]);

	useEffect(() => {
		return subWindowsRef.current.forEach((subWindow) => subWindow.close());
	}, []);

	const openWindow = (key: WindowKey) => {
		let newSubWindow = window.open(`/window/${key}`, undefined, "popup=yes,left=100,top=100,width=320,height=320");

		if (newSubWindow) {
			subWindowsRef.current = [...subWindowsRef.current, newSubWindow];
		}
	};

	return (
		<WindowsContext.Provider
			value={{
				openWindow,
			}}
		>
			{children}
		</WindowsContext.Provider>
	);
}

export function useWindows() {
	const context = useContext(WindowsContext);
	if (context === undefined) {
		throw new Error("useWindows must be used within a WindowsProvider");
	}
	return context;
}
