import { create } from "zustand";

import type { CarsData, Positions, State } from "@/types/state.type";

type DataStore = {
	state: State | null;
	carsData: CarsData | null;
	positions: Positions | null;

	setState: (state: State) => void;
	setCarsData: (carsData: CarsData) => void;
	setPositions: (positions: Positions) => void;
};

export const useDataStore = create<DataStore>((set) => ({
	state: null,
	carsData: null,
	positions: null,

	setState: (state: State) => set({ state }),
	setCarsData: (carsData: CarsData) => set({ carsData }),
	setPositions: (positions: Positions) => set({ positions }),
}));
