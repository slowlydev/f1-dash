import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

type SpeedUnit = "metric" | "imperial";

type SettingsStore = {
	delay: number;
	setDelay: (delay: number) => void;

	speedUnit: SpeedUnit;
	setSpeedUnit: (speedUnit: SpeedUnit) => void;
};

export const useSettingsStore = create(
	persist<SettingsStore>(
		(set) => ({
			delay: 0,
			setDelay: (delay: number) => set({ delay }),

			speedUnit: "metric",
			setSpeedUnit: (speedUnit: SpeedUnit) => set({ speedUnit }),
		}),
		{
			name: "settings-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
