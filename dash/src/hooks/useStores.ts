import type { CarsData, Positions, State } from "@/types/state.type";

import { useCarDataStore, useDataStore, usePositionStore } from "@/stores/useDataStore";

type Fns = {
	updateState: (state: State) => void;
	updatePosition: (pos: Positions) => void;
	updateCarData: (car: CarsData) => void;
};

export const useStores = (): Fns => {
	const dataStore = useDataStore();
	const positionStore = usePositionStore();
	const carDataStore = useCarDataStore();

	return {
		updateState: (v) => dataStore.set(v),
		updatePosition: (v) => positionStore.set(v),
		updateCarData: (v) => carDataStore.set(v),
	};
};
