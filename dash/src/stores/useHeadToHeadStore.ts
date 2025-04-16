import { create } from "zustand";
import { persist } from "zustand/middleware";

type HeadToHeadStore = {
	first: string | null;
	second: string | null;

	setFirst: (first: string | null) => void;
	setSecond: (second: string | null) => void;
};

export const useHeadToHeadStore = create<HeadToHeadStore>()(
	persist(
		(set) => ({
			first: null,
			second: null,

			setFirst: (first: string | null) => set({ first }),
			setSecond: (second: string | null) => set({ second }),
		}),
		{
			name: "head-to-head",
		},
	),
);
