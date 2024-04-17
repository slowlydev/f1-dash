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
			<div className="flex flex-col items-center gap-4">
				<p className="text-center text-4xl font-bold">Welcome to the walkthrough!</p>
				<p>
					This walkthrough should show you how to navigate f1-dash <br />
					and give you a idea about the different information f1-dash shows. <br />
					You can skip this walkthrough and do it later by resetting it in the settings.
				</p>
			</div>
		),
	},
	{
		type: "popup",
		label: (
			<>
				This is the menu, it is used to navigate between pages and more. <br />
				You will get a popup if you are about to switch away <br />
				from live timing to avoid any accidents.
			</>
		),
		id: "walkthrough-menu",
	},
	{
		type: "popup",
		label: (
			<>
				With this "windows" menu point you can open additional windows <br />
				for example the track map, team radios and race control messages.
			</>
		),
		id: "walkthrough-windows",
	},
	{
		type: "popup",
		label: (
			<>
				This allows to stop and start the data, this allows you to easily <br />
				sync f1-dash with your F1 video stream.
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
		type: "popup",
		label: (
			<>
				This shows the Three Letter Acronym (TLA) <br /> of the driver and the current position
			</>
		),
		id: "walkthrough-driver-position",
	},
	{
		type: "popup",
		label: (
			<>
				This is shows if the driver has DRS active <br /> or it is possible or it shows PIT if the driver is in the Pit
				lane
			</>
		),
		id: "walkthrough-driver-drs",
	},
	{
		type: "popup",
		label: (
			<>
				The current tire of the driver, <br /> how any pit stops he has made <br /> and how many laps he has done on it
				and if its used or not
			</>
		),
		id: "walkthrough-driver-tire",
	},
	{
		type: "popup",
		label: (
			<>
				This shows the current lap number <br /> and the status of the driver
			</>
		),
		id: "walkthrough-driver-info",
	},
	{
		type: "popup",
		label: (
			<>
				This shows the gap to the driver in front <br /> and the driver behind
			</>
		),
		id: "walkthrough-driver-gap",
	},
	{
		type: "popup",
		label: (
			<>
				This shows last and personal best <br /> lap time of the driver
			</>
		),
		id: "walkthrough-driver-laptime",
	},
	{
		type: "popup",
		label: (
			<>
				This shows the current sector times of the driver <br /> as well as the sectors mini sectors
			</>
		),
		id: "walkthrough-driver-sectors",
	},
	{
		type: "modal",
		label: (
			<div className="flex w-80 flex-col items-center gap-4">
				<p className="text-2xl font-bold">Thats it for the walkthrough!</p>
				<p>I hope with this short walkthrough of the dashboard you learned more about the functionality of f1-dash.</p>
				<p>I hope you gave fun using f1-dash!</p>
				<p>If you want to restart the walkthrough got to the settings page found in the top left menu.</p>
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
			localStorage.setItem("walkthrough", "hi there, it seems you did the walkthrough :)");
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
										<div className="flex w-full items-center justify-end gap-2">
											<p className="text-zinc-500">
												Step {step + 1} / {walkthroughScript.length}
											</p>

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
