"use client";

import { DriverHistory } from "@/types/history.type";
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

type Values = {
	drivers: {
		[key: string]: DriverHistory;
	};
};

const HistoryContext = createContext<Values | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
	const drivers = useRef<string[]>([]);

	return (
		<HistoryContext.Provider
			value={{
				openWindow,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
}

export function useHistory() {
	const context = useContext(HistoryContext);
	if (context === undefined) {
		throw new Error("useHistory must be used within a HistoryProvider");
	}
	return context;
}
