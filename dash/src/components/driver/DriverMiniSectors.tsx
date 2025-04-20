import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sectors: TimingDataDriver["sectors"];
	bestSectors: TimingStatsDriver["bestSectors"] | undefined;
	tla: string;
};

export default function DriverMiniSectors({ sectors = [], bestSectors, tla }: Props) {
	const showMiniSectors = useSettingsStore((state) => state.showMiniSectors);
	const showBestSectors = useSettingsStore((state) => state.showBestSectors);

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
						>
							{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
						</p>

						{showBestSectors && (
							<p className="text-sm font-medium leading-none text-zinc-600">
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
	return (
		<div
			style={wide ? { width: 10, height: 5, borderRadius: 2 } : { height: 10, width: 8, borderRadius: 3.2 }}
			className={clsx({
				"bg-yellow-500": status === 2048 || status === 2052, // TODO unsure
				"bg-emerald-500": status === 2049,
				"bg-violet-600": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-zinc-700": status === 0,
			})}
		/>
	);
}
