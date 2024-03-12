"use client";

import { type ReactNode, createContext, useState, useContext, useRef, MutableRefObject, useEffect } from "react";
import InfoPopover from "../components/InfoPopover";
import { motion } from "framer-motion";

type ModalStep = {
	type: "modal";
	label: JSX.Element;
};

type PopupStep = {
	type: "popup";
	label: JSX.Element;
	className: string;
};

type Step = ModalStep | PopupStep;

type Values = {
	start: () => void;
	end: () => void;
};

const WalkthroughContext = createContext<Values | undefined>(undefined);

export function WalkthroughProvider({ children }: { children: ReactNode }) {
	const [step, setStep] = useState<number>(0);
	const [inProgress, setInProgress] = useState<boolean>(false);

	const walkthroughScript: Step[] = [
		{
			type: "modal",
			label: <>Welcome to the walkthrough, press next to go the next element</>,
		},
		{
			type: "popup",
			label: <>Here you can open parts of the live timing in separate windows </>,
			className: "walkthrough-windows",
		},
		{
			type: "popup",
			label: <>This allows to stop and start playback and setup delay</>,
			className: "walkthrough-playback",
		},
		{
			type: "popup",
			label: (
				<>
					This allows you to manually <br /> set the delay of the stream in seconds
				</>
			),
			className: "walkthrough-delay",
		},
		{
			type: "popup",
			label: (
				<>
					With the mode switcher you can <br /> show more or less data, or even select your custom mode
				</>
			),
			className: "walkthrough-mode",
		},
		{
			type: "popup",
			label: (
				<>
					This shows air, track temperature as well as humidity, <br /> if a session is rainy and wind direction & speed
				</>
			),
			className: "walkthrough-weather",
		},
	];

	const start = () => setInProgress(true);
	const end = () => setInProgress(false);

	const currentStep = walkthroughScript[step];

	useEffect(() => {
		if (typeof window != undefined) {
			const isDone = localStorage.getItem("walkthrough");
			if (!!!isDone) {
				setInProgress(true);
				// localStorage.setItem("walkthrough", "hi there, it seems u did the walkthrough :)");
			}
		}
	}, []);

	return (
		<WalkthroughContext.Provider value={{ start, end }}>
			{currentStep.type === "popup" && (
				<motion.div layout>
					<InfoPopover children={undefined} show={inProgress}></InfoPopover>
				</motion.div>
			)}

			{children}
		</WalkthroughContext.Provider>
	);
}

export function useWalkthrough() {
	const context = useContext(WalkthroughContext);
	if (context === undefined) {
		throw new Error("useWalkthrough must be used within a WalkthroughProvider");
	}
	return context;
}
