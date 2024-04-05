"use client";

import { useEffect, useState } from "react";

import { modes, type UiElements } from "@/context/ModeContext";

import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import DelayInput from "@/components/DelayInput";

export default function SettingsPage() {
	const [tableHeaders, setTableHeaders] = useState<boolean>(false);
	const [sectorFastest, setSectorFastest] = useState<boolean>(false);
	const [carMetrics, setCarMetrics] = useState<boolean>(false);

	const [delay, setDelay] = useState<number>(0);

	useEffect(() => {
		if (typeof window != undefined) {
			const delayStorage = localStorage.getItem("delay");
			const delayValue = delayStorage ? parseInt(delayStorage) : 0;

			setDelay(delayValue);

			const customStorage = localStorage.getItem("custom");
			const customSettings: UiElements = customStorage ? JSON.parse(customStorage) : modes.custom;

			setTableHeaders(customSettings.tableHeaders);
			setSectorFastest(customSettings.sectorFastest);
			setCarMetrics(customSettings.carMetrics);
		}
	}, []);

	const handleUpdate = (type: "sector" | "table" | "car", newValue: boolean) => {
		if (typeof window != undefined) {
			const customStorage = localStorage.getItem("custom");
			const customSettings: UiElements = customStorage ? JSON.parse(customStorage) : modes.custom;

			switch (type) {
				case "car": {
					customSettings.carMetrics = newValue;
					break;
				}
				case "table": {
					customSettings.tableHeaders = newValue;
					break;
				}
				case "sector": {
					customSettings.sectorFastest = newValue;
					break;
				}
			}

			localStorage.setItem("custom", JSON.stringify(customSettings));
		}
	};

	const updateDelay = (newDelay: number) => {
		setDelay(newDelay);

		if (typeof window != undefined) {
			localStorage.setItem("delay", `${newDelay}`);
		}
	};

	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<h1 className="my-4 text-3xl">Settings</h1>

			<h2 className="my-4 text-2xl">Configure Custom Mode</h2>

			<p className="mb-4 text-zinc-500">
				Here you can setup the "custom" mode that u can activate with the slider in the top right on the dashboard. Its
				here to toggle some parts of the UI u might want or not want to see, as u might prefer more or less data or
				information and/or a simpler UI.
			</p>

			<div className="flex gap-2">
				<Toggle
					enabled={tableHeaders}
					setEnabled={(v) => {
						setTableHeaders(v);
						handleUpdate("table", v);
					}}
				/>
				<p className="text-zinc-500">Show Table Headers</p>
			</div>

			<div className="flex gap-2">
				<Toggle
					enabled={sectorFastest}
					setEnabled={(v) => {
						setSectorFastest(v);
						handleUpdate("sector", v);
					}}
				/>
				<p className="text-zinc-500">Show Fastest Sector Times</p>
			</div>

			<div className="flex gap-2">
				<Toggle
					enabled={carMetrics}
					setEnabled={(v) => {
						setCarMetrics(v);
						handleUpdate("car", v);
					}}
				/>
				<p className="text-zinc-500">Show Car Metrics (RPM, Gear, Speed)</p>
			</div>

			<h2 className="my-4 text-2xl">Delay</h2>

			<p className="mb-4 text-zinc-500">
				Here you have to option to set a delay for the data, it will displayed the amount entered in seconds later than
				on the live edge. On the Dashboard page there is the same delay input field so you can set it without going to
				the settings. It can be found in the most top bar on the right side.
			</p>

			<div className="flex items-center gap-2">
				<DelayInput delay={delay} setDebouncedDelay={updateDelay} />
				<p className="text-zinc-500">Delay in seconds</p>
			</div>

			<Button className="mt-2 !bg-red-500" onClick={() => updateDelay(0)}>
				Reset delay
			</Button>
		</div>
	);
}
