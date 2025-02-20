import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

import { GridStack } from "@/lib/Grid";

type GridStore = {
	stack: GridStack;
	setStack: (stack: GridStack) => void;
};

const DEFAULT: GridStack = {
	direction: "row",
	children: [
		{
			direction: "column",
			children: [
				{
					component: "leaderboard",
				},
				{
					component: "trackviolations",
				},
			],
		},
		{
			direction: "column",
			children: [
				{
					component: "trackmap",
				},
				{
					direction: "row",
					children: [
						{
							component: "racecontrol",
							style: { height: "40rem", width: "50%" },
						},
						{
							component: "teamradios",
							style: { height: "40rem", width: "50%" },
						},
					],
				},
			],
		},
	],
};

export const useGridStore = create(
	persist<GridStore>(
		(set) => ({
			stack: DEFAULT,
			setStack: (stack) => set({ stack }),
		}),
		{
			name: "grid-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
