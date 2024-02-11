"use client";

import { AnimatePresence } from "framer-motion";

import QualifyingDriver from "@/components/QualifyingDriver";

import { DriverType } from "@/types/state.type";
import { sortQuali } from "@/lib/sortQuali";
import clsx from "clsx";

type Props = {
	drivers: DriverType[] | undefined;
};

export default function Qualifying({ drivers }: Props) {
	const qualiDrivers = !drivers
		? []
		: drivers
				.filter((d) => d.status != "PIT")
				.filter((d) => d.sectors.map((s) => s.current.pb).includes(true))
				.filter((d) => d.sectors[2].segments[0] != 0);

	return (
		<div className="flex gap-4">
			<AnimatePresence>
				{qualiDrivers.sort(sortQuali).map((driver) => (
					<QualifyingDriver key={`qualifying.driver.${driver.short}`} driver={driver} />
				))}

				{qualiDrivers.length < 1 && (
					<>
						{new Array(5).fill(null).map((_, i) => (
							<SkeletonQualifingDriver key={`skeleton.qualifying.driver.${i}`} />
						))}
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

const SkeletonQualifingDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-gray-700";

	return (
		<div className="flex w-[18rem] flex-col gap-2">
			<div className="flex justify-between">
				<div className={clsx(animateClass, "w-20")} />
				<div className={clsx(animateClass, "w-8")} />
			</div>

			<div className="flex w-full justify-between">
				<div className={clsx(animateClass, "w-8")} />

				<div className="flex flex-col items-end gap-1">
					<div className={clsx(animateClass, "!h-4 w-10")} />
					<div className={clsx(animateClass, "!h-3 w-14")} />
				</div>
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "!h-4")} />
						<div className={clsx(animateClass, "!h-3")} />
					</div>
				))}
			</div>
		</div>
	);
};
