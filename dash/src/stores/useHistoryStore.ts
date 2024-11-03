import { create } from "zustand";

type Timestamped<T> = {
	value: T;
	timestamp: number;
};

type HistoryStore = {
	gap: {
		[key: string]: Timestamped<number>[];
	};
	sectors: {
		[key: string]: [Timestamped<number>[], Timestamped<number>[], Timestamped<number>[]];
	};
	laptime: {
		[key: string]: Timestamped<number>[];
	};

	addGap: (driverNr: string, gap: number) => void;
	addSector: (driverNr: string, gap: number) => void;
	addLaptime: (driverNr: string, gap: number) => void;
};

export const useHistoryStore = create<HistoryStore>((set) => ({
	gap: {},
	sectors: {},
	laptime: {},

	addGap: (driverNr: string, gap: number) =>
		set((state) => {
			state.gap[driverNr] = [...(state.gap[driverNr] ?? []), { value: gap, timestamp: Date.now() }];
			return { gap: state.gap };
		}),

	addSector: (driverNr: string, sector: number) =>
		set((state) => {
			state.sectors[driverNr] = [
				[...(state.sectors[driverNr]?.[0] ?? []), { value: sector, timestamp: Date.now() }],
				state.sectors[driverNr]?.[1] ?? [],
				state.sectors[driverNr]?.[2] ?? [],
			];
			return { sectors: state.sectors };
		}),

	addLaptime: (driverNr: string, laptime: number) =>
		set((state) => {
			state.laptime[driverNr] = [...(state.laptime[driverNr] ?? []), { value: laptime, timestamp: Date.now() }];
			return { laptime: state.laptime };
		}),
}));
