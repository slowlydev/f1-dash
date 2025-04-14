"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import xIcon from "public/icons/xmark.svg";

import type { Driver } from "@/types/state.type";

import SegmentedControls from "@/components/SegmentedControls";
import SelectMultiple from "@/components/SelectMultiple";
import DriverTag from "@/components/driver/DriverTag";
import DelayInput from "@/components/DelayInput";
import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import Footer from "@/components/Footer";
import Slider from "@/components/Slider";
import Input from "@/components/Input";

import { useSettingsStore } from "@/stores/useSettingsStore";

import { env } from "@/env.mjs";

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

			<div className="flex gap-2">
				<Toggle enabled={settings.showBestSectors} setEnabled={(v) => settings.setShowBestSectors(v)} />
				<p className="text-zinc-500">Show Drivers Best Sectors</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.showMiniSectors} setEnabled={(v) => settings.setShowMiniSectors(v)} />
				<p className="text-zinc-500">Show Drivers Mini Sectors</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.raceControlChime} setEnabled={(v) => settings.setRaceControlChime(v)} />
				<p className="text-zinc-500">Play Race Control Chime</p>
			</div>

			{settings.raceControlChime && (
				<div className="flex max-w-52 flex-col gap-2">
					<p>Race Control Chime Volume</p>
					<div className="flex flex-row items-center gap-2">
						<Slider value={settings.raceControlChimeVolume} setValue={(v) => settings.setRaceControlChimeVolume(v)} />
						<Input
							value={String(settings.raceControlChimeVolume)}
							setValue={(v) => {
								const numericValue = Number(v);
								if (!isNaN(numericValue)) {
									settings.setRaceControlChimeVolume(numericValue);
								}
							}}
						/>
					</div>
				</div>
			)}

			<h2 className="my-4 text-2xl">Favorite Drivers</h2>

			<p className="mb-4">Select your favorite drivers to highlight them on the dashboard.</p>

			<FavoriteDrivers />

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

const FavoriteDrivers = () => {
	const [drivers, setDrivers] = useState<Driver[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { favoriteDrivers, setFavoriteDrivers, removeFavoriteDriver } = useSettingsStore();

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(`${env.NEXT_PUBLIC_LIVE_SOCKET_URL}/api/drivers`);
				const data = await res.json();
				setDrivers(data);
			} catch (e) {
				setError("failed to fetch favorite drivers");
			}
		})();
	}, []);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				{favoriteDrivers.map((driverNumber) => {
					const driver = drivers?.find((d) => d.racingNumber === driverNumber);

					if (!driver) return null;

					return (
						<div key={driverNumber} className="flex items-center gap-1 rounded-xl border border-zinc-700 p-1">
							<DriverTag teamColor={driver.teamColour} short={driver.tla} />

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => removeFavoriteDriver(driverNumber)}
							>
								<Image src={xIcon} alt="x" width={30} />
							</motion.button>
						</div>
					);
				})}
			</div>

			<div className="w-80">
				<SelectMultiple
					placeholder="Select favorite drivers"
					options={drivers ? drivers.map((d) => ({ label: d.fullName, value: d.racingNumber })) : []}
					selected={favoriteDrivers}
					setSelected={setFavoriteDrivers}
				/>
			</div>
		</div>
	);
};
