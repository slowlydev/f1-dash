import { createContext, Dispatch, ReactNode, useContext, useEffect, useState, type SetStateAction } from "react";

const speedPreferences = ["km/h", "mp/h"] as const;

export type SpeedPreference = (typeof speedPreferences)[number];

type Values = {
	speedPreference: SpeedPreference;
	setSpeedPreference: (speedPref: SpeedPreference) => void;
};

const SpeedPreferenceContext = createContext<Values | undefined>(undefined);

export function SpeedPreferenceProvider({ children }: { children: ReactNode }) {
	const [speedPref, setSpeedPreference] = useState<SpeedPreference>("km/h");

	useEffect(() => {
		if (typeof window != undefined) {
			const localStorageSpeedPreference = localStorage.getItem("speedPreference");

			if (localStorageSpeedPreference && speedPreferences.includes(localStorageSpeedPreference as SpeedPreference)) {
				setSpeedPreference(localStorageSpeedPreference as SpeedPreference);
			}
		}
	}, []);

	const handleSetSpeedPreference = (speedPref: SpeedPreference) => {
		setSpeedPreference(speedPref);

		if (typeof window != undefined) {
			localStorage.setItem("speedPreference", speedPref);
		}
	};

	return (
		<SpeedPreferenceContext.Provider
			value={{
				speedPreference: speedPref,
				setSpeedPreference: handleSetSpeedPreference,
			}}
		>
			{children}
		</SpeedPreferenceContext.Provider>
	);
}

export function useSpeedPreference() {
	const context = useContext(SpeedPreferenceContext);
	if (context === undefined) {
		throw new Error("useSpeedPreference must be used within a SpeedPreferenceProvider");
	}
	return context;
}
