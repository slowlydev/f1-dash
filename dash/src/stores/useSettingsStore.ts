import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";

type SpeedUnit = "metric" | "imperial";

type SettingsStore = {
	delay: number;
	setDelay: (delay: number) => void;

	speedUnit: SpeedUnit;
	setSpeedUnit: (speedUnit: SpeedUnit) => void;

	showCornerNumbers: boolean;
	setShowCornerNumbers: (showCornerNumbers: boolean) => void;

	carMetrics: boolean;
	setCarMetrics: (carMetrics: boolean) => void;

	tableHeaders: boolean;
	setTableHeaders: (tableHeaders: boolean) => void;

	favoriteDrivers: string[];
	setFavoriteDrivers: (nrs: string[]) => void;
	toggleFavoriteDriver: (nr: string) => void;
};

export const useSettingsStore = create(
	subscribeWithSelector(
		persist<SettingsStore>(
			(set) => ({
				delay: 0,
				setDelay: (delay: number) => set({ delay }),

				speedUnit: "metric",
				setSpeedUnit: (speedUnit: SpeedUnit) => set({ speedUnit }),

				showCornerNumbers: false,
				setShowCornerNumbers: (showCornerNumbers: boolean) => set({ showCornerNumbers }),

				carMetrics: false,
				setCarMetrics: (carMetrics: boolean) => set({ carMetrics }),

				tableHeaders: false,
				setTableHeaders: (tableHeaders: boolean) => set({ tableHeaders }),

				favoriteDrivers: [],
				setFavoriteDrivers: (nrs: string[]) => set({ favoriteDrivers: nrs }),
				toggleFavoriteDriver: (nr: string) => {
					set((state) => ({
						favoriteDrivers: state.favoriteDrivers.includes(nr)
							? state.favoriteDrivers.filter((n) => n !== nr)
							: [...state.favoriteDrivers, nr],
					}));
				},
			}),
			{
				name: "settings-storage",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);
