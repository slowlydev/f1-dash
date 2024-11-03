import { create } from "zustand";

type LapStore = {
	laptime: {
		[key: string]: number;
	};

	setLaptime: (driverNr: string, start: number) => void;
};

export const useLapStore = create<LapStore>((set) => ({
	laptime: {},

	setLaptime: (driverNr: string, start: number) => {
		set((state) => {
			state.laptime[driverNr] = start;
			return { laptime: state.laptime };
		});
	},
}));
