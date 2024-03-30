"use client";

import { type ReactNode, createContext, useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import InfoPopover from "@/components/InfoPopover";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

type ModalStep = {
	type: "modal";
	label: JSX.Element;
};

type PopupStep = {
	type: "popup";
	label: JSX.Element;
	id: string;
};

type Step = ModalStep | PopupStep;

type Values = {
	start: () => void;
	end: () => void;
};

const walkthroughScript: Step[] = [
	{
		type: "modal",
		label: (
			<div className="flex flex-col items-center">
				<p className="text-2xl font-bold">Welcome to the walkthrough!</p>
				<p>press next to go the next element</p>
			</div>
		),
	},
	{
		type: "popup",
		label: (
			<>
				Here you can open parts of <br />
				the live timing in separate windows
			</>
		),
		id: "walkthrough-windows",
	},
	{
		type: "popup",
		label: (
			<>
				This allows to stop and start <br /> playback and setup delay
			</>
		),
		id: "walkthrough-playback",
	},
	{
		type: "popup",
		label: (
			<>
				This allows you to manually <br /> set the delay of the stream in seconds
			</>
		),
		id: "walkthrough-delay",
	},
	{
		type: "popup",
		label: (
			<>
				With the mode switcher you can <br /> show more or less data, or even select your custom mode
			</>
		),
		id: "walkthrough-mode",
	},
	{
		type: "popup",
		label: (
			<>
				This shows air, track temperature as well as humidity, <br /> if a session is rainy and wind direction & speed
			</>
		),
		id: "walkthrough-weather",
	},
	{
		type: "modal",
		label: (
			<div className="flex w-80 flex-col items-center gap-4">
				<p className="text-2xl font-bold">Thats it for the walkthrough!</p>
				<p>I hope u learned more about the functionality of f1-dash. Have fun using it!</p>
			</div>
		),
	},
];

const resetIndex = () => {
	const steps = walkthroughScript.filter((s) => s.type === "popup") as PopupStep[];
	const ids = steps.map((s) => s.id);
	ids.forEach((id) => {
		const el = document.getElementById(id);
		if (el) el.style.zIndex = "auto";
	});
};

const getCords = (id: string | null) => {
	if (typeof window != undefined && id) {
		const el = document.getElementById(id);
		const popup = document.getElementById("popup");

		if (el && popup) {
			const maxWidthWindow = window.innerWidth;
			const popupWidth = popup.clientWidth;

			const baseX = el.offsetLeft + el.clientWidth / 2;
			const x = maxWidthWindow < baseX + popupWidth ? baseX - popupWidth : baseX;

			resetIndex();
			el.style.zIndex = "10";

			return { x, y: el.offsetTop + el.clientHeight + 13 };
		}
	}

	return { x: 0, y: 0 };
};

const WalkthroughContext = createContext<Values | undefined>(undefined);

export function WalkthroughProvider({ children }: { children: ReactNode }) {
	const [step, setStep] = useState<number>(0);
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [[x, y], setCords] = useState<[number, number]>([0, 0]);

	const updatePosition = (step: number): void => {
		const currentStep = walkthroughScript[step];
		resetIndex();
		const cords = getCords(currentStep.type === "popup" ? currentStep.id : null);
		setCords([cords.x, cords.y]);
	};

	const start = () => setInProgress(true);
	const end = () => {
		setInProgress(false);
		if (typeof window != undefined) {
			localStorage.setItem("walkthrough", "hi there, it seems u did the walkthrough :)");
		}
	};

	const next = () => {
		setStep((current) => {
			const next = current + 1;
			updatePosition(next);
			return next;
		});
	};
	const back = () => {
		setStep((current) => {
			const next = current - 1;
			updatePosition(next);
			return next;
		});
	};

	useEffect(() => {
		updatePosition(step);
	}, [step]);

	useEffect(() => {
		if (typeof window != undefined) {
			const isDone = localStorage.getItem("walkthrough");
			if (!!!isDone) {
				setInProgress(true);
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("resize", () => updatePosition(step), false);
		updatePosition(step);
		return () => window.removeEventListener("resize", () => updatePosition(step), false);
	}, [step]);

	const isLastStep = walkthroughScript.length - 1 === step;
	const currentStep = walkthroughScript[step];

	return (
		<WalkthroughContext.Provider value={{ start, end }}>
			<AnimatePresence>
				{inProgress && currentStep && (
					<>
						{currentStep.type === "popup" && (
							<>
								<div className="fixed inset-0 z-[8] backdrop-blur-sm transition-opacity" />

								<motion.div
									layout
									id="popup"
									className="absolute z-[10]"
									style={{ left: x, top: y }}
									exit={{ scale: 0, opacity: 0 }}
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
								>
									<InfoPopover show={inProgress} elementChildren>
										<p className="whitespace-nowrap text-white">{currentStep.label}</p>
										<div className="flex w-full justify-end gap-2">
											<Button className="!border !border-zinc-600 !bg-transparent" onClick={() => end()}>
												Skip
											</Button>

											{step > 0 && step < walkthroughScript.length && (
												<Button className="!bg-zinc-700" onClick={() => back()}>
													Back
												</Button>
											)}

											<Button className="!bg-blue-500" onClick={() => next()}>
												Next
											</Button>
										</div>
									</InfoPopover>
								</motion.div>
							</>
						)}

						<Modal open={currentStep.type === "modal"}>
							<div className="mb-4">{currentStep.label}</div>

							{isLastStep ? (
								<Button onClick={() => end()}>Close</Button>
							) : (
								<div className="flex justify-end gap-2">
									<Button className="!border !border-zinc-600 !bg-transparent" onClick={() => end()}>
										Skip
									</Button>

									{step > 0 && step < walkthroughScript.length && (
										<Button className="!bg-zinc-700" onClick={() => back()}>
											Back
										</Button>
									)}

									<Button className="!bg-blue-500" onClick={() => next()}>
										Next
									</Button>
								</div>
							)}
						</Modal>
					</>
				)}
			</AnimatePresence>

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
