import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { Sector, TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sectors: TimingDataDriver["sectors"];
	bestSectors: TimingStatsDriver["bestSectors"] | undefined;
	tla: string;
};

export default function DriverMiniSectors({ sectors = [], bestSectors, tla }: Props) {
	const showMiniSectors = useSettingsStore((state) => state.showMiniSectors);
	const showBestSectors = useSettingsStore((state) => state.showBestSectors);

	const sectorTimeTooltip = (sector: Sector, index: number) => {
		const sectorName = `Sector ${index + 1}`;
		if (sector.overallFastest) {
			return `Overall Best ${sectorName}`;
		}
		if (sector.personalFastest) {
			return `Personal Best ${sectorName}`;
		}
		if (!!sector.value) {
			return sectorName;
		}
		if (!!sector.previousValue) {
			return `${sectorName} (previous)`;
		}
		return null;
	};

	return (
		<div className="flex gap-2">
			{sectors.map((sector, i) => (
				<div key={`sector.${tla}.${i}`} className="flex flex-col gap-1">
					{showMiniSectors && (
						<div className="flex flex-row gap-1">
							{sector.segments.map((segment, j) => (
								<MiniSector
									wide={showBestSectors && showMiniSectors}
									status={segment.status}
									key={`sector.mini.${tla}.${j}`}
								/>
							))}
						</div>
					)}

					<div className={clsx("flex", showMiniSectors ? "items-center gap-1" : "flex-col")}>
						<p
							className={clsx(
								"text-lg font-semibold leading-none",
								getTimeColor(sector.overallFastest, sector.personalFastest),
								!sector.value ? "text-zinc-600" : "",
							)}
							data-tooltip-id="tooltip"
							data-tooltip-content={sectorTimeTooltip(sector, i)}
						>
							{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
						</p>

						{showBestSectors && (
							<p
								className="text-sm font-medium leading-none text-zinc-600"
								data-tooltip-id="tooltip"
								data-tooltip-content={bestSectors && bestSectors[i].value ? `Best sector ${i + 1}` : null}
							>
								{bestSectors && bestSectors[i].value ? bestSectors[i].value : "-- ---"}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function MiniSector({ status, wide }: { status: number; wide: boolean }) {
	let color = null;
	let tooltip = null;
	switch (status) {
		case 2048:
		case 2052: // TODO unsure
			color = "bg-yellow-500";
			break;
		case 2049:
			color = "bg-emerald-500";
			tooltip = "Personal Best (mini-sector)";
			break;
		case 2051:
			color = "bg-violet-500";
			tooltip = "Overall Best (mini-sector)";
			break;
		case 2064:
			color = "bg-blue-500";
			tooltip = "Pit Lane";
			break;
		case 0:
			color = "bg-zinc-700";
			break;
	}

	return (
		<div
			style={wide ? { width: 10, height: 5, borderRadius: 2 } : { height: 10, width: 8, borderRadius: 3.2 }}
			className={clsx(color)}
			data-tooltip-id="tooltip"
			data-tooltip-content={tooltip}
		/>
	);
}
