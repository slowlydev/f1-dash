"use client";

import { useEffect, useState } from "react";

import { modes, type UiElements } from "@/context/ModeContext";

import Toggle from "@/components/Toggle";

export default function SettingsPage() {
	const [tableHeaders, setTableHeaders] = useState<boolean>(false);
	const [sectorFastest, setSectorFastest] = useState<boolean>(false);
	const [carMetrics, setCarMetrics] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window != undefined) {
			console.log("loading storage...");

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
				<p>Show Table Headers</p>
			</div>

			<div className="flex gap-2">
				<Toggle
					enabled={sectorFastest}
					setEnabled={(v) => {
						setSectorFastest(v);
						handleUpdate("sector", v);
					}}
				/>
				<p>Show Fastest Sector Times</p>
			</div>

			<div className="flex gap-2">
				<Toggle
					enabled={carMetrics}
					setEnabled={(v) => {
						setCarMetrics(v);
						handleUpdate("car", v);
					}}
				/>
				<p>Show Car Metrics (RPM, Gear, Speed)</p>
			</div>
		</div>
	);
}
