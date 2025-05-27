"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

import xIcon from "public/icons/xmark.svg";

import type { Driver } from "@/types/state.type";

import { env } from "@/env";
import { useSettingsStore } from "@/stores/useSettingsStore";

import DriverTag from "@/components/driver/DriverTag";
import SelectMultiple from "@/components/ui/SelectMultiple";

export default function FavoriteDrivers() {
	const [drivers, setDrivers] = useState<Driver[] | null>(null);

	// TODO handle loading state
	// TODO handle error state
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [error, setError] = useState<string | null>(null);

	const { favoriteDrivers, setFavoriteDrivers, removeFavoriteDriver } = useSettingsStore();

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(`${env.NEXT_PUBLIC_LIVE_URL}/api/drivers`);
				const data = await res.json();
				setDrivers(data);
			} catch {
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
						<div key={driverNumber} className="flex items-center gap-1 rounded-xl border border-zinc-800 p-1">
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
}
