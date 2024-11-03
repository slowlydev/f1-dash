import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

import type { ReactNode } from "react";

export type Stack = {
	direction: "row" | "col";
	items: (Stack | ReactNode)[];
};

type CustomUIStore = {
	tree: Stack | null;
	setTree: (tree: Stack) => void;
};

export const useCustomUIStore = create(
	persist<CustomUIStore>(
		(set) => ({
			tree: null,
			setTree: (tree) => set({ tree }),
		}),
		{
			name: "custom-ui-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
