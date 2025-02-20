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
					direction: "row",
					children: [
						{
							component: "trackviolations",
							style: { width: "50%" },
						},
						{
							component: "teamradios",
							style: { height: "40rem", width: "50%" },
						},
					],
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
					component: "racecontrol",
					style: { height: "20rem" },
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
