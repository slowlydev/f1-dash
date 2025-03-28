"use client";

import Image from "next/image";

import { Stint } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	stints: Stint[] | undefined;
};

export default function DriverHistoryTires({ stints }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);
	const unknownCompound = (stint: Stint) =>
		!["soft", "medium", "hard", "intermediate", "wet"].includes(stint.compound?.toLowerCase() ?? "");

	return (
		<div className="flex flex-row items-center justify-start gap-1">
			{stints &&
				stints.map((stint, i) => (
					<div className="flex flex-col items-center gap-1" key={`driver.${i}`}>
						{unknownCompound(stint) && <Image src={"/tires/unknown.svg"} width={32} height={32} alt="unknown" />}
						{!unknownCompound(stint) && stint.compound && (
							<Image
								src={`/tires/${stint.compound.toLowerCase()}.${"svg"}`}
								width={32}
								height={32}
								alt={stint?.compound ?? ""}
							/>
						)}

						<p
							className={`whitespace-nowrap text-sm font-medium leading-none ${darkMode ? "text-tertiary-dark" : "text-tertiary-light"}`}
						>
							{stint.totalLaps}L
						</p>
					</div>
				))}

			{(!stints || stints.length < 1) && (
				<>
					<LoadingTire />
					<LoadingTire />
					<LoadingTire />
				</>
			)}
		</div>
	);
}

function LoadingTire() {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div className="flex flex-col items-center gap-1">
			<div className={`h-8 w-8 animate-pulse rounded-full ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} />
			<div className={`h-4 w-8 animate-pulse rounded-md ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} />
		</div>
	);
}
