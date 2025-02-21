import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

import { GridStack } from "@/lib/Grid";
import { DEFAULT_GRID } from "@/grid";

type GridStore = {
	stack: GridStack;
	setStack: (stack: GridStack) => void;
};

export const useGridStore = create(
	persist<GridStore>(
		(set) => ({
			stack: DEFAULT_GRID,
			setStack: (stack) => set({ stack }),
		}),
		{
			name: "grid-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
