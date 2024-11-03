"use client";

import SegmentedControls from "@/components/SegmentedControls";
import DelayInput from "@/components/DelayInput";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Footer from "@/components/Footer";

import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SettingsPage() {
	const settings = useSettingsStore();

	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<h1 className="my-4 text-3xl">Settings</h1>

			<h2 className="my-4 text-2xl">Visual</h2>

			<div className="flex gap-2">
				<Toggle enabled={settings.carMetrics} setEnabled={(v) => settings.setCarMetrics(v)} />
				<p className="text-zinc-500">Show Car Metrics (RPM, Gear, Speed)</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.showCornerNumbers} setEnabled={(v) => settings.setShowCornerNumbers(v)} />
				<p className="text-zinc-500">Show Corner Numbers on Track Map</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.tableHeaders} setEnabled={(v) => settings.setTableHeaders(v)} />
				<p className="text-zinc-500">Show Driver Table Header</p>
			</div>

			<h2 className="my-4 text-2xl">Favorite Drivers</h2>

			<p className="mb-4">Choose your favorite drivers to highlight them on the dashboard.</p>

			<h2 className="my-4 text-2xl">Speed Metric</h2>

			<p className="mb-4">Choose the unit in which you want to display speeds.</p>

			<SegmentedControls
				id="speed-unit"
				selected={settings.speedUnit}
				onSelect={settings.setSpeedUnit}
				options={[
					{ label: "km/h", value: "metric" },
					{ label: "mp/h", value: "imperial" },
				]}
			/>

			<h2 className="my-4 text-2xl">Delay</h2>

			<p className="mb-4">
				Here you have to option to set a delay for the data, it will displayed the amount entered in seconds later than
				on the live edge. On the Dashboard page there is the same delay input field so you can set it without going to
				the settings. It can be found in the most top bar on the right side.
			</p>

			<div className="flex items-center gap-2">
				<DelayInput />
				<p className="text-zinc-500">Delay in seconds</p>
			</div>

			<Button className="mt-2 !bg-red-500" onClick={() => settings.setDelay(0)}>
				Reset delay
			</Button>

			<Footer />
		</div>
	);
}
