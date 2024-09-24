import { createContext, Dispatch, ReactNode, useContext, useEffect, useState, type SetStateAction } from "react";

const speedPreferences = ["km/h", "mp/h"] as const;

type SpeedPreference = (typeof speedPreferences)[number];

type Values = {
	speedPreference: SpeedPreference;
	setSpeedPreference: Dispatch<SetStateAction<Values["speedPreference"]>>;
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

	useEffect(() => {
		if (typeof window != undefined) {
			localStorage.setItem("speedPreference", speedPref);
		}
	}, [speedPref]);

	return (
		<SpeedPreferenceContext.Provider
			value={{
				speedPreference: speedPref,
				setSpeedPreference,
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
